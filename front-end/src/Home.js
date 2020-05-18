import React from 'react'
import { Link } from 'react-router-dom'
import Nevbar from './Nevbar.js'

class Home extends React.Component {

  getHello() {
    return 'Hello World';
  }

  render() {
    return (
      <div className="App">

        <Nevbar />
          {/* <Link to="/Upload"> <h1>Upload</h1></Link> */}
          <Link to="/TestUpPic"> <h1>Upload</h1></Link>
      </div>


    )
  }
}

export default Home
