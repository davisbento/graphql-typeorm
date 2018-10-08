
import * as bcrypt from "bcryptjs";
import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { GQL } from "../../types/schema";

export const resolvers: ResolverMap = {
  Query: {
    bye: () => "bye",
  },
  Mutation: {
    register: async (_, { email, password }: GQL.IRegisterOnMutationArguments) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const user = User.create({
          email,
          password: hashedPassword
        });

        await user.save();
        return true;
      }
      catch (err) {
        console.log(err)
        return false;
      }
    }
  }
};