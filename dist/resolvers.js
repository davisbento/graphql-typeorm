"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = {
    Query: {
        hello: (_, { name }) => `Bye ${name || "World"}`
    },
    Mutation: {
        register: (_, { email, password }) => {
            return email + password;
        }
    }
};
//# sourceMappingURL=resolvers.js.map