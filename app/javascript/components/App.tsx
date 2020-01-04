import React, {
  FunctionComponent,
  ReactNode,
  useReducer,
  useContext,
} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import Home from 'components/Home';
import Login from 'components/Login';
import NotFound from 'components/NotFound';
import {
  AuthContext,
  authReducer,
  authInitialState,
} from 'contexts/AuthContext';
import './app.scss';

const PrivateRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  const { auth } = useContext(AuthContext);

  if (localStorage.getItem('user') !== null) {
    auth.isAuthenticated = true;
    auth.user = JSON.parse(localStorage.getItem('user') as string);
    auth.token = localStorage.getItem('token');
  }

  return (
    <Route
      {...rest}
      render={({ location }): ReactNode => (
        auth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      )}
    />
  );
};

const PublicRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  const { auth } = useContext(AuthContext);

  if (localStorage.getItem('user') !== null) {
    auth.isAuthenticated = true;
    auth.user = JSON.parse(localStorage.getItem('user') as string);
    auth.token = localStorage.getItem('token');
  }

  return (
    <Route
      {...rest}
      render={(): ReactNode => (
        auth.isAuthenticated ? (
          <Redirect to="/" />
        ) : (
          children
        )
      )}
    />
  );
};

const App: FunctionComponent = () => {
  const [auth, dispatchAuth] = useReducer(authReducer, authInitialState);

  return (
    <AuthContext.Provider value={{ auth, dispatchAuth }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
          <PublicRoute path="/login">
            <Login />
          </PublicRoute>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
