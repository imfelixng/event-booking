import React, { Component } from 'react';
import './App.scss'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import AuthContext from './contexts/auth-context';

class App extends Component {

  state = {
    token: null,
    userID: null,
  }

  login = (token, userID, tokenExpriration) => {
    this.setState({
      token,
      userID
    })
  };

  logout = () => {
    this.setState({
      token: null,
      userID: null
    })
  }

  render() {
    return (
      <Router>
        <React.Fragment>
          <AuthContext.Provider value = {{
            token: this.state.token,
            userID: this.state.userID,
            login: this.login,
            logout: this.logout
          }}>
            <MainNavigation 
            />
            <main className = "main-content">
              <Switch>
                {
                  !this.state.token && <Redirect from = "/" to = "/auth" exact/>
                }
                {
                  this.state.token && <Redirect from = "/auth" to = "/events" exact/>
                }
                {
                  !this.state.token && <Redirect from = "/bookings" to = "/auth" exact/>
                }
                {
                  !this.state.token && <Route path = "/auth" exact component = {Auth} />
                }
                <Route path = "/events" exact component = {Events} />
                {
                  this.state.token && <Route path = "/bookings" exact component = {Bookings} />
                }
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
