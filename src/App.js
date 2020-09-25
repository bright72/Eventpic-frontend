import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './LoginForm.js'
import Register from './Register.js'
import AddEvent from './AddEvent.js';
import ListofEvent from './ListofEvent.js';
import EditEvent from './EditEvent.js';
import MoreDetail from './MoreDetail.js';
import ShowPicture from './ShowPicture.js';
import Upload from './components/UploadFunction.js'
import UploadTest from './components/Upload';
import './Style.css'
import 'bulma/css/bulma.css'

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={ListofEvent} />
      <Route exact path="/ListofEvent" component={ListofEvent} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Register" component={Register} />
      <Route exact path="/AddEvent" component={AddEvent} />
      <Route exact path="/EditEvent/:id" component={EditEvent} />
      <Route exact path="/MoreDetail/:id" component={MoreDetail} />
      <Route exact path="/ShowPicture" component={ShowPicture} />
      <Route exact path="/Upload/:id" component={Upload} />
      <Route exact path="/UploadTest" component={UploadTest} />
    </Switch>
  </Router>

)

export default App
