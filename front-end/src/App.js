import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      
      
    </Switch>
  </Router>
)

export default App;
