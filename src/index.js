import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'
import fetch from 'node-fetch'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

// create typeDefs
const typeDefs = gql`
  type Pokemon {
    name: String!
    height: Int
    id: Int!
    weight: Float!
  }

  type PokemonResult {
    name: String!
    url: String!
  }

  type Query {
    pokemon(name: String): Pokemon!
    pokemons(name: String, limit: Int): [PokemonResult]!
  }
`

const resolvers = {
  Query: {
    async pokemon(_, {name}) {
      const pokemon = await fetch(`${API_URL}/${name}`).then(d =>
        d.json()
      )
      return pokemon;
    },
    async pokemons(_, {limit}) {
      const pokemons = await fetch(`${API_URL}?&limit=${limit}`).then(d =>
        d.json()
      )
      // TODO: get url from each result and do a fetch for it
      // then remove PokemonResult type and just return [Pokemon]
      return pokemons.results;
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