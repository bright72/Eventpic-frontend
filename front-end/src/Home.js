import React from 'react'
import { Link } from 'react-router-dom'

class Home extends React.Component {

  getHello() {
    return 'Hello World';
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Link to="/Login"> <h1>Login</h1></Link>
          <Link to="/Upload"> <h1>Upload</h1></Link>
          <Link to="/AddEvent"> <h1>Add Event</h1> </Link>
        </header >
      </div>


    )
  }
}

export default Home
