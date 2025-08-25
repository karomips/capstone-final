import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Approval from './components/Approval/Approval';
import Profile from './components/Profile/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
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
        <nav>
          <Link to="/approve">Approval Page</Link> |{' '}
          <Link to="/profile">Profile</Link>
        </nav>
        <Routes>
          <Route path="/approve" element={<Approval />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Approval />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
