import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect from = "/" to = "/auth" exact/>
          <Route path = "/auth" exact component = {Auth} />
          <Route path = "/events" exact component = {Events} />
          <Route path = "/bookings" exact component = {Bookings} />
        </Switch>
      </Router>
    );
  }
}

export default App;
