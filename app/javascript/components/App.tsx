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
import { toast, Slide } from 'react-toastify';
import moment from 'moment';
import Home from 'components/Home';
import Task from 'components/Task';
import Profile from 'components/Profile';
import Login from 'components/Login';
import Signup from 'components/Signup';
import NotFound from 'components/NotFound';
import {
  AuthContext,
  authReducer,
  authInitialState,
} from 'contexts/AuthContext';
import './app.scss';

toast.configure({
  position: toast.POSITION.TOP_CENTER,
  closeButton: false,
  transition: Slide,
  hideProgressBar: true,
});
moment.updateLocale('en-GB', {
  calendar: {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    lastDay: '[Yesterday]',
    nextWeek: 'dddd',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  },
});

const PrivateRoute: FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  const { auth } = useContext(AuthContext);

  if (localStorage.getItem('user') !== null && !auth.user && !auth.token) {
    auth.user = JSON.parse(localStorage.getItem('user') as string);
    auth.token = localStorage.getItem('token');
  }

  return (
    <Route
      {...rest}
      render={({ location }): ReactNode => (
        auth.user ? (
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
    auth.user = JSON.parse(localStorage.getItem('user') as string);
    auth.token = localStorage.getItem('token');
  }

  return (
    <Route
      {...rest}
      render={(): ReactNode => (
        auth.user ? (
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
          <PrivateRoute path="/tasks/:id">
            <Task />
          </PrivateRoute>
          <PrivateRoute path="/profile">
            <Profile />
          </PrivateRoute>
          <PublicRoute path="/login">
            <Login />
          </PublicRoute>
          <PublicRoute path="/signup">
            <Signup />
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
