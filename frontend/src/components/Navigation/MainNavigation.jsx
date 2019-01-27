import React from 'react'
import {NavLink} from 'react-router-dom';
import './MainNavigation.scss';
import AuthContext from '../../contexts/auth-context';

const MainNavigation = props => (
  <React.Fragment>
    <AuthContext.Consumer>
      {
        (context) => (
          <header className = "main-navigation">
            <div className = "main-navigation__logo">
              <h1>EasyEvent</h1>
            </div>
            <nav className = "main-navigation__item">
              <ul>
                {
                  !context.token &&
                  <li>
                    <NavLink to = "/auth">
                      Authenticate
                    </NavLink>
                  </li>
                }
                <li>
                  <NavLink to = "/events">
                    Events
                  </NavLink>
                </li>
                {
                  context.token &&
                  <React.Fragment>
                    <li>
                      <NavLink to = "/bookings">
                        Bookings
                      </NavLink>
                    </li>
                  </React.Fragment>
                }
              </ul>
            </nav>
          </header>
        )
      }
    </AuthContext.Consumer>
  </React.Fragment>
);

export default MainNavigation;