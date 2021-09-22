import { ApolloProvider } from "@apollo/client";
import type { AppProps /*, AppContext */ } from 'next/app'
import { Products } from "../components/products";

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql/",
  cache: new InMemoryCache(),
});



function MyApp ({ Component, pageProps }:AppProps) {
  return <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  
};

export default MyApp;
