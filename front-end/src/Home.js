import React from 'react'
import { Link } from 'react-router-dom'





class Home extends React.Component {

  getHello() {
    return 'Hello World';
  }

  render() {
    return (
      <div className = "App">
        <header className="App-header">
          <Link to="/Todo"> <h1>{this.getHello()}</h1></Link>
          <Link to="/Login"> <h1>Login</h1></Link>
        </header >
      </div>


    )
  }
}




export default Home
