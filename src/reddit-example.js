import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'
import fetch from 'node-fetch'

// create typeDefs
const typeDefs = gql`
  type Post {
    link: String!
    title: String!
  }

  type Query {
    posts(limit: Int): [Post]!
  }
`

const resolvers = {
  Query: {
    async posts(_, {limit}) {
      const posts = await fetch('https://www.reddit.com/.json').then(d =>
        d.json()
      )

      return posts.data.children.map(p => p.data)
    }
  }
}

// create server with ApolloServer
// typeDefs + resolvers with Query and Mutation
const server = new ApolloServer({ typeDefs, resolvers })
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
})

/*
  {
    posts{
      title
    }
  }
*/