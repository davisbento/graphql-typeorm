import { User } from './entity/User';
import { ResolverMap } from "./types/graphql-utils";
import { GQL } from "./types/schema";
import * as bcrypt from "bcryptjs";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`,
    users: async () => await User.find(),
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