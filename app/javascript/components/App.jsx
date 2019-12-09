import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import Home from './Home';
import About from './About';

export default function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
