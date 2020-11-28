import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Login from './LoginForm.js'
import Register from './Register.js'
import AddEvent from './AddEvent.js';
import ListofEvent from './ListofEvent.js';
import EditEvent from './EditEvent.js';
import MoreDetail from './MoreDetail.js';
import Upload from './UploadFunction.js'
import UploadParticipant from './UploadParticipant';
import ListofParticipant from './ListofParticipant';
import ViewPicture from './ViewPicture';
import ChoosePicture from './ChoosePicture';
import AllowsPictures from './AllowsPictures';
import Process from './Process';
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
      <Route exact path="/Upload/:id" component={Upload} />
      <Route exact path="/UploadParticipant/:id" component={UploadParticipant} />
      <Route exact path="/ListofParticipant/:id" component={ListofParticipant} />
      <Route exact path="/ListofParticipant/:event_id/ChoosePicture/:participant_id" component={ChoosePicture} />
      <Route exact path="/ViewPicture/:event_id/:participant_id" component={ViewPicture} />
      <Route exact path="/allow/:organize_id/:event_id/:participant_id" component={AllowsPictures} />
      <Route exact path="/Process/:event_id/" component={Process} />
      
    </Switch>
  </Router>

)

export default App
