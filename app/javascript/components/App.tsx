import React, { FunctionComponent, ReactNode, useReducer, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
  RouteComponentProps,
} from 'react-router-dom';
import Home from 'components/Home';
import Login from 'components/Login';
import NotFound from 'components/NotFound';
import { AuthContext, reducer, initialState } from 'contexts/AuthContext';
import './app.scss';

const PrivateRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  // @ts-ignore
  const { state } = React.useContext(AuthContext);

  if (localStorage.getItem('token') !== null) {
    state.isAuthenticated = true;
    state.user = localStorage.getItem('user');
    state.token = localStorage.getItem('token');
  }

  return (
    <Route
      {...rest}
      render={({ location }: RouteComponentProps): ReactNode => (
        state.isAuthenticated ? (
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

const App: FunctionComponent = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    // @ts-ignore
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
