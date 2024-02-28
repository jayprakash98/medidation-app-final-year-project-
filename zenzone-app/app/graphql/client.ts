import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HOST } from "../../ipcongif";

export const client = new ApolloClient({
  uri: `${HOST}/graphql`,
  cache: new InMemoryCache(),
});
