import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from 'apollo-link-http';

const directionalLink = new RetryLink().split(
  (operation) => operation.getContext().clientName === 'mainnet',
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2" }),
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2" })
);


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: directionalLink
});



  function App() {
    return (
      <div>
        <ApolloProvider client={client}>
        <Dashboard></Dashboard>
        </ApolloProvider>
        
      </div>
    );
  }

export default App;
