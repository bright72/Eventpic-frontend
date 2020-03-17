import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import './Style.css'
import Home from './Home.js'
import Login from './Login.js'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/Login" component={Login} />
    </Switch>
  </Router>
)

export default App
