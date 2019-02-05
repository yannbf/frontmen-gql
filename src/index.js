import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'

// create typeDefs
const typeDefs = gql`
  # type - Item (name string, done boolean)
  type Item {
    name: String,
    done: Boolean
  }

  # create query - getItem
  type Query {
    getItem: Item
  }

  # create mutation - createItem
  type Mutation {
    createItem: Item
  }
`

const resolvers = {
  Query: {
    getItem: () => {},
  },
  Mutation: {
    createItem: () => {},
  }
}

// create server with ApolloServer
// typeDefs + resolvers with Query and Mutation
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
})

// Check later
// https://medium.com/the-guild/graphql-code-generator-a34e3785e6fb
// https://github.com/dotansimha/graphql-code-generator