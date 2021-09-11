import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from '@apollo/client';
//Init firebase statistics:
import firebase from './config/firebase';


//Set up directional links
const directionalLink =
  new RetryLink().split(
  (operation) => operation.getContext().clientName === 'mainnet',
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2" }),
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2" }),
  );

//Instantiate Apollo client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: directionalLink,
});

  export default function App() {

    return (
      <div key='dashboard'>
        <ApolloProvider client={client}>
        <Dashboard></Dashboard>

        </ApolloProvider>
        
      
      </div>
    );
  }