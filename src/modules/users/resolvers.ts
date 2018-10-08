import { User } from './../../entity/User';
import { ResolverMap } from "../../types/graphql-utils";
import { GQL } from "../../types/schema";

export const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Bye ${name || "World"}`,
    users: async () => await User.find(),
  },
};