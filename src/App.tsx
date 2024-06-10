import React from 'react';
import logo from './logo.svg';
import { styled } from '@mui/material';
import './App.css';

const Title = styled('h1')({
  fontSize: 40,
  color: 'red',
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Title>
          Holi!
        </Title>
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
