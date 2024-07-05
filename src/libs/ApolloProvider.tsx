import { ApolloClient, InMemoryCache, ApolloProvider as ApolloClientProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_URL,
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloClientProvider client={client}>
    {children}
  </ApolloClientProvider>
);

export default ApolloProvider;
