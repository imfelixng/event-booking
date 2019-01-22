import React, { Component } from 'react';
import './App.scss'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <MainNavigation />
          <main className = "main-content">
            <Switch>
              <Redirect from = "/" to = "/auth" exact/>
              <Route path = "/auth" exact component = {Auth} />
              <Route path = "/events" exact component = {Events} />
              <Route path = "/bookings" exact component = {Bookings} />
            </Switch>
          </main>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
