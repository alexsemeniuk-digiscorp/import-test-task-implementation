import introspection from '@/graphql';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  ServerError,
  ServerParseError,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { createUploadLink } from 'apollo-upload-client';

const removeTypenameLink = removeTypenameFromVariables();

const httpLink = createUploadLink({
  uri: `${import.meta.env.WEBSITE_API_URL ?? '/graphql'}`,
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  // Call the next link in the middleware chain.
  return forward(operation);
});

const errorLink = onError(({ networkError }) => {
  if (networkError) {
    const error = networkError as ServerError | ServerParseError;

    if (error.statusCode === 401) {
      window.location.reload();
    }
  }
});

export const client = new ApolloClient({
  link: ApolloLink.from([removeTypenameLink, errorLink, authLink, httpLink]),
  connectToDevTools: import.meta.env.DEV,
  queryDeduplication: true,
  assumeImmutableResults: true,
  cache: new InMemoryCache({
    resultCaching: import.meta.env.PROD,
    possibleTypes: introspection.possibleTypes,
    typePolicies: {
      GlobalSearchResultItem: {
        keyFields: ['id', 'entityType'],
      },
    },
  }),
});
