import { ApolloClient, InMemoryCache, ApolloProvider as ApolloClientProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }: { children: React.ReactNode }) => (
  <ApolloClientProvider client={client}>
    {children}
  </ApolloClientProvider>
);

export default ApolloProvider;
