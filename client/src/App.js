import React from 'react';
import Compiler from './components/compiler';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact strict component={Compiler} />

      </div>
    </Router>
  );
}

export default App;
