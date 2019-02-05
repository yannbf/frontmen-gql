import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'
import fetch from 'node-fetch'
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools'
import { createGithubSchema, createGithubResolvers } from './github';

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

// create typeDefs
const typeDefs = gql`
  type Pokemon {
    name: String!
    height: Int
    id: Int!
    weight: Float!
  }

  type User {
    name: String
  }

  type Query {
    pokemon(name: String): Pokemon!
    user(name: String): User!
  }
`

const resolvers = {
  Query: {
    async pokemon(_, {name}) {
      const pokemon = await fetch(`${API_URL}/${name}`).then(d =>
        d.json()
      )
      debugger
      return pokemon;
    }
  }
}

const localSchema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// create server with ApolloServer
// typeDefs + resolvers with Query and Mutation
const createServer = async () => {
  const extendedUser = gql`
    extend type User {
      profile: Github_User
    }
  `

  const { transformed, og } = await createGithubSchema()
  const finalSchema = mergeSchemas({
    schemas: [localSchema, transformed, extendedUser]
  })
  const server = new ApolloServer({
    schema: finalSchema,
    resolvers: createGithubResolvers(og)
  })

  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  })
}

createServer()
/*
  {
    user(login: "yannbf") {
    name
    avatarUrl
    company
  }
 {
  pokemon(name: "pikachu"){
    name,
    height,
    id
  }
}
{
  pokemons(limit: 200){
    name,
    height,
    id
  }
}
*/