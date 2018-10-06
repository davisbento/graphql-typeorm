"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const graphql_yoga_1 = require("graphql-yoga");
const graphql_import_1 = require("graphql-import");
const resolvers_1 = require("./resolvers");
const typeorm_1 = require("typeorm");
const path = require("path");
const typeDefs = graphql_import_1.importSchema(path.join(__dirname, "schema.graphql"));
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers: resolvers_1.resolvers });
typeorm_1.createConnection().then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
});
//# sourceMappingURL=index.js.map