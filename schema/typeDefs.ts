import { gql } from "https://deno.land/x/oak_graphql/mod.ts";

// Graphql type

export const typeDefs = gql`
    type User {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        users: [User]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): User
    }
`