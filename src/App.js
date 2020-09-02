import React, { Component, useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import netlifyAuth from './netlifyAuth';
import {
  IdentityContextProvider,
  useIdentityContext,
} from 'react-netlify-identity';

// import logo from './logo.svg';
import './App.css';

import { Welcome } from './components/Welcome';

const PublicRoute = (props: Props) => {
  const { isLoggedIn } = useIdentityContext();
  return isLoggedIn ? <Redirect to='/home' /> : <Route {...props} />;
};

const PrivateRoute = (props: Props) => {
  const { isLoggedIn } = useIdentityContext();
  return isLoggedIn ? <Route {...props} /> : <Redirect to='/welcome' />;
};

const App = () => {
  let [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated);
  let [user, setUser] = useState(null);

  useEffect(() => {
    netlifyAuth.initialize((user) => {
      setLoggedIn(!!user);
      setUser(user);
      console.log(user);
    });
  }, [loggedIn]);

  let login = () => {
    netlifyAuth.authenticate((user) => {
      setLoggedIn(!!user);
      setUser(user);
      netlifyAuth.closeModal();
    });
  };

  let logout = () => {
    netlifyAuth.signout(() => {
      setLoggedIn(false);
      setUser(null);
    });
  };

  return (
    <IdentityContextProvider url='https://testingident.netlify.app/.netlify/identity'>
      <BrowserRouter>
        <Switch>
          <PublicRoute exact path='/' component={Welcome} />
          <PublicRoute exact path='/welcome' component={LambdaDemo} />
          <PrivateRoute path='/home' component={Welcome} />
        </Switch>
      </BrowserRouter>
      <div className='App'>
        <header className='App-header'>
          {loggedIn ? (
            <div>
              You are logged in! +{' '}
              {user && <>Welcome {user?.user_metadata.full_name}!</>}
              <br />+ <button onClick={logout}>+ Log out here.</button>
            </div>
          ) : (
            <button onClick={login}>Log in here.</button>
          )}
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    </IdentityContextProvider>
  );
};

export default App;

class LambdaDemo extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, msg: null };
  }

  handleClick = (api) => (e) => {
    e.preventDefault();

    this.setState({ loading: true });
    fetch('/.netlify/functions/' + api)
      .then((response) => response.json())
      .then((json) => this.setState({ loading: false, msg: json.msg }));
  };

  render() {
    const { loading, msg } = this.state;

    return (
      <p>
        <button onClick={this.handleClick('hello')}>
          {loading ? 'Loading...' : 'Call Lambda'}
        </button>
        <button onClick={this.handleClick('async-dadjoke')}>
          {loading ? 'Loading...' : 'Call Async Lambda'}
        </button>
        <br />
        <span>{msg}</span>
      </p>
    );
  }
}
