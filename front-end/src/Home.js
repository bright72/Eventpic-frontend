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
        

      </div>


    )
  }
}

export default Home
