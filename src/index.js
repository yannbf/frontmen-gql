import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'

const users = [
  {
    id: 1,
    username: 'Jean',
    friends: [2]
  },
  {
    id: 2,
    username: 'Claude',
    friends: [1]
  },
  {
    id: 3,
    username: 'Van Damme',
    friends: []
  },
]

// create typeDefs
const typeDefs = gql`
  # type - Item (name string, done boolean)
  type Item {
    name: String!
    done: Boolean!
  }

  # type User (username string, items: [Item])
  type User {
    id: String
    username: String!
    friends: [User]
  }

  input NameInput {
    name: String!
  }

  # create query - getItem
  type Query {
    getItem: Item
    user(input: NameInput): User
  }

  # create input. Type can't be used as argument, so input is used for that.
  input NewItemInput {
    name: String!
  }

  # create mutation - createItem
  type Mutation {
    createItem(input: NewItemInput): Item!
  }
`

const resolvers = {
  Query: {
    getItem() {},
    user(_, {input: {name} }) {
      return users.find(user => user.username === name)
    }
  },
  Mutation: {
    createItem(_, args, context, info) {
      console.log(args.input)
      console.log(JSON.stringify(info, null, 2))
    },
  },
  User: {
    friends(user) {
      return users.filter(u => user.friends.includes === u.id)
    },
    username(user) {
      return user.username
    },
    id(user) {
      return user._id
    }
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