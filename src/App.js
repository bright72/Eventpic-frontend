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
import UploadParticipant from './UploadParticipant';
import ListofParticipant from './ListofParticipant';
import ViewPicture from './ViewPicture';
import ChoosePicture from './ChoosePicture';
import ContactForm from './ContactForm';
import showdatabackend from './showdatabackend';
import AllowsPictures from './AllowsPictures';
import './Style.css'

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
      <Route exact path="/UploadParticipant/:id" component={UploadParticipant} />
      <Route exact path="/ListofParticipant/:id" component={ListofParticipant} />
      <Route exact path="/ListofParticipant/:event_id/ChoosePicture/:participant_id" component={ChoosePicture} />
      <Route exact path="/ViewPicture/:event_id/:participant_id" component={ViewPicture} />
      <Route exact path="/ContactForm" component={ContactForm} />
      <Route exact path="/showdatabackend" component={showdatabackend} />
      <Route exact path="/allow/:organize_id/:event_id/:participant_id" component={AllowsPictures} />
      
    </Switch>
  </Router>

)

export default App
