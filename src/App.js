import React, { useState, useEffect } from 'react';
import netlifyAuth from './netlifyAuth';

// import logo from './logo.svg';
import './App.css';

const App = () => {
  let [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated);
  let [user, setUser] = useState(null);

  useEffect(() => {
    netlifyAuth.initialize((user) => {
      setLoggedIn(!!user);
      setUser(user);
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
  );
};

export default App;

// class LambdaDemo extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { loading: false, msg: null };
//   }

//   handleClick = (api) => (e) => {
//     e.preventDefault();

//     this.setState({ loading: true });
//     fetch('/.netlify/functions/' + api)
//       .then((response) => response.json())
//       .then((json) => this.setState({ loading: false, msg: json.msg }));
//   };

//   render() {
//     const { loading, msg } = this.state;

//     return (
//       <p>
//         <button onClick={this.handleClick('hello')}>
//           {loading ? 'Loading...' : 'Call Lambda'}
//         </button>
//         <button onClick={this.handleClick('async-dadjoke')}>
//           {loading ? 'Loading...' : 'Call Async Lambda'}
//         </button>
//         <br />
//         <span>{msg}</span>
//       </p>
//     );
//   }
// }
