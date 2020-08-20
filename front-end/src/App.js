import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import './Style.css'
import Home from './Home.js'
import Login from './Login.js'
import Register from './Register.js'
// import ImageUpload from './components/ImageUpload.jsx';
import TestUpload from './components/TestUpPic.js';
import AddEvent from './AddEvent.js';
import ListofEvent from './ListofEvent.js';
import EditEvent from './EditEvent.js';
import MoreDetail from './MoreDetail.js';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Register" component={Register} />
      {/* <Route exact path="/Upload" component={ImageUpload} /> */}
      <Route exact path="/TestUpPic" component={TestUpload} />
      <Route exact path="/AddEvent" component={AddEvent} />
      <Route exact path="/ListofEvent" component={ListofEvent} />
      <Route exact path="/EditEvent/:id" component={EditEvent} />
      <Route exact path="/MoreDetail/:id" component={MoreDetail}/>
      
    </Switch>
  </Router>
)

export default App
