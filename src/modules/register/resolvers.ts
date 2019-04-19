import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { ResolverMap } from '../../types/graphql-utils';
import { User } from '../../entity/User';
import { GQL } from '../../types/schema';
import { formatYupError } from '../../utils/formatYupError';
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';
import { sendEmail } from '../../utils/sendEmail';
import { v4 } from 'uuid';

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(3)
    .max(255),
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'bye',
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return formatYupError(error);
      }

      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id'],
      });

      if (userAlreadyExists) {
        return {
          message: 'Error',
          success: false,
          errors: [
            {
              path: 'email',
              message: 'already taken',
            },
          ],
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = User.create({
        id: v4(),
        email,
        password: hashedPassword,
      });

      await user.save();

      const emailLink = await createConfirmEmailLink(url, user.id, redis);

      if (process.env.NODE_ENV !== 'test') {
        await sendEmail(email, emailLink);
      }

      return {
        message: 'User registered successfully',
        success: true,
      };
    },
  },
};
