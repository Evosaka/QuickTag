import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Operation,
  NextLink,
} from "@apollo/client";
import Cookies from "js-cookie";

const graphqlClient = (): ApolloClient<NormalizedCacheObject> => {
  const token = Cookies.get("fabtoken");
  const apiUrl = Cookies.get("apiurl");

  const httpLink = new HttpLink({
    uri: `${apiUrl}/fabapi`,
  });

  const authMiddleware = new ApolloLink(
    (operation: Operation, forward: NextLink) => {
      // add the authorization to the headers
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }));

      return forward(operation);
    }
  );

  const client = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "no-cache",
        errorPolicy: "ignore",
      },
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
  return client;
};

export default graphqlClient;
