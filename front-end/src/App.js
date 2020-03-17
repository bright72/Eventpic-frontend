import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import './Style.css'
import Home from './Home.js'
import Todo from './Todo.js'
import Counter from './Counter.js';
import Login from './Login.js'
import Nevbar from './Nevbar.js'


const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/todo" component={Todo} />
      <Route exact path="/counter" component={Counter} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Nevbar" component={Nevbar} />
      

      
    </Switch>
  </Router>
)


export default App
