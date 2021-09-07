import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link } from "react-router-dom";
import BookList from './components/BookList';
import InsertBook from './components/InsertBook';
import UpdateBook from './components/UpdateBook';
import Login from './components/Login';
import {
  ApolloClient,
  ApolloProvider, 
  InMemoryCache,
  HttpLink,
  split

} from "@apollo/client";
import { ProtectedRoute } from './protected.route';
import auth from './auth';
import { useHistory } from 'react-router';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import CarsList from './components/CarsList';

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/v1/graphql',
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql',
  // headers: {
  //   'x-hasura-access-key': 'zfuKdqZBwg75jKeI79C61mSdzikNYwNhlZeC1kt3pyolwNqIMQ0Re8CNoBiICeJY'
  // }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client=new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
function App() {
  let history = useHistory();
  return (
    <ApolloProvider client={client}>
      <div className="App">
        {/* <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/" className="navbar-brand">
            Book
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/list"} className="nav-link">
                Books
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
            <li className="nav-item" onClick={()=>{
              auth.logout(()=>{
                history.push("/");
              })
            }}>
                <Link className="nav-link">
                Logout
              </Link>
            </li>
          </div>
        </nav> */}
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute exact path="/list" component={BookList} />
          <ProtectedRoute exact path="/add" component={InsertBook} />
          <ProtectedRoute exact path="/update/:id" component={UpdateBook} />
          <Route path="/cars" component={CarsList} />
          <Route path="*" component={()=>"404 NOT FOUND"} />
        </Switch>
      </div>
    </ApolloProvider> 
  );
}

export default App;
