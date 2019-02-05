/**
 * create http link
 * set context link
 * merge links
 * get introspective schema
 * make remote schema with link
 * transform Remove, Rename root and types
 * create resolvers with mergeInfo delegateToSchema
 */

import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'node-fetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  RenameTypes,
  FilterRootFields
} from 'graphql-tools'

export const createGithubSchema = async () => {

  // Makes it so GraphQL understands this is another GraphQL source
  const http = new HttpLink({ uri: 'https://api.github.com/graphql', fetch })
  const link = setContext(() => ({
    headers: {
      Authorization: 'bearer 6cf7f0c26e701ba653e5436689055af707d63321'
    }
  })).concat(http)

  // take the link and go to the server in this location and grab their schema
  const schema = await introspectSchema(link)

  // create remote executable schema (which can already be used standalone)
  const githubSchema = makeRemoteExecutableSchema({
    schema,
    link
  })

  const transformedSchema = transformSchema(githubSchema, [
    new RenameTypes(name => (name === 'User' ? 'Github_User' : name)),
    new FilterRootFields((op, fieldName) => {
      return fieldName === 'user'
    })
  ])

  return { transformed: transformedSchema, og: githubSchema }
}

export const createGithubResolvers = schema => {
  return {
    User: {
      profile(user, args, context, info) {
        return info.mergeInfo.delegateToSchema({
          schema,
          operation: 'query',
          fieldName: 'user',
          args: {
            login: 'yannbf'
          },
          context,
          info
        })
      }
    }
  }
}
