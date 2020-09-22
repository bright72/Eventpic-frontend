import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'
import './Style.css'
import Login from './LoginForm.js'
import Register from './Register.js'
import UpPicture from './components/UpPicture.js';
import AddEvent from './AddEvent.js';
import ListofEvent from './ListofEvent.js';
import EditEvent from './EditEvent.js';
import MoreDetail from './MoreDetail.js';
import ShowPicture from './ShowPicture.js';
//Import npm bulma
// import 'bulma/css/bulma.css'
//Import npm react-filepond
// import { FilePond, File, registerPlugin } from 'react-filepond';
// // Import FilePond styles
// import 'filepond/dist/filepond.min.css';

// FilePond Register plugin
// import FilePondImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
// registerPlugin(FilePondImagePreview);

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={ListofEvent} />
      <Route exact path="/ListofEvent" component={ListofEvent} />
      <Route exact path="/Login" component={Login} />
      <Route exact path="/Register" component={Register} />
      <Route exact path="/UpPicture" component={UpPicture} />
      <Route exact path="/AddEvent" component={AddEvent} />
      <Route exact path="/EditEvent/:id" component={EditEvent} />
      <Route exact path="/MoreDetail/:id" component={MoreDetail} />
      <Route exact path="/ShowPicture" component={ShowPicture} />
    </Switch>
  </Router>

)

export default App
