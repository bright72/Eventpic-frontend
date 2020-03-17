import React, { useState } from 'react'
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import logo from './logo.svg';
import Counter from './Counter';


const About = () => {

  const [text, setText] = useState("")
  const [todo, setTodo] = useState([])


  const Test = (ss) => {
    return <h1>Hello {ss.name}</h1>;
  }

  const handleOnChange = (event) => {
    setText(event.target.value)
  }

  const addList = (event) => {
    event.preventDefault()
    let test = todo
    test.push(text)
    setTodo(test)
    console.log(todo)
  }

  const showList = () => {
    let result = [
      <ul>
        <li>
          fsdfdsfs
        </li>
      </ul>
      ,
      <ul>
        <li>
          fsdfdsfs
        </li>
      </ul>
    ]
    return result
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>TO Do list</h1>
        <Form onSubmit={addList}>
          <Form.Label>Add new to do ..</Form.Label>
          <Form.Control type="text" value={text} onChange={handleOnChange} placeholder="Add new to do .." />
          <Button type="submit" >
            Add
          </Button>
        </Form>
        {showList()}
      </header >
    </div>
  );

}





export default About
