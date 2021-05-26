import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {
  createApolloClient,
  restartWebsockets,
} from 'vue-cli-plugin-apollo/graphql-client'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApolloClient } from 'vue-cli-plugin-apollo'

Vue.use(VueApollo)

const AUTH_TOKEN = 'apollo-token'

const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:8080/graphql'

const defaultOptions = {
  httpEndpoint,
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:8080/graphql',
  tokenName: AUTH_TOKEN,
  persisting: false,
  websocketsOnly: false,
  ssr: false,
}

export function createProvider(options = {}): VueApollo {
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  apolloClient.wsClient = wsClient

  return new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      },
    },
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.log(
        '%cError',
        'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
        error.message
      )
    },
  })
}

export async function onLogin(
  apolloClient: ApolloClient,
  token: string
): Promise<void> {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }

  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)

  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
export async function onLogout(apolloClient: ApolloClient): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }

  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)

  try {
    await apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
