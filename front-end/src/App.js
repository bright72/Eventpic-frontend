import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import './Style.css'
import Home from './Home.js'
import Login from './Login.js'
import ImageUpload from './components/ImageUpload.jsx';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/Home" component={Home} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Upload" component={ImageUpload} />

    </Switch>
  </Router>
)

export default App
