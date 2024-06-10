import React from 'react';
import { gql, useQuery } from '@apollo/client';

import logo from './logo.svg';
import './App.css';

const QUERY = gql`
  query Query {
  getStudents {
    code
    message
    success
    students {
      name
      lastName
    }
  }
}
`;

function App() {
  const results = useQuery(QUERY);
  console.log(results);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Holi!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
