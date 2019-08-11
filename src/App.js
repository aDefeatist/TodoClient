import React from 'react';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import { 
Button,
Navbar,
InputGroup,
InputGroupAddon,
Input,
ListGroup,
ListGroupItem,
ButtonGroup } from 'reactstrap';


class App extends React.Component {
  state = {
    title: '',
    content: [],
  }

  componentDidMount() {
    // if using the same URL over and over, maybe move it to a CONST uptop. 
    axios.get('http://localhost:4000/')
      .then(res => {
        console.log(res);
        this.setState({ content: res.data })
      })
      .catch(err => console.log(err))
  }

  getItems() {
    axios.get('http://localhost:4000/')
      .then(res => {
        console.log(res);
        this.setState({ content: res.data })
      })
      .catch(err => console.log(err))
  }

  onSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/', {
      content: this.state.title
    })
    .then(res => {
      let newArray = this.state.content;
      console.log(res.data);
      newArray.push(res.data);
      this.setState({ content: newArray });
    })
    
    // this resets the field but not the state. although next time you type IN the field it resets the state to whats in,
    // it might be cleaner to do a this.setState({ title: '' }). still need the reset if you aren't having a controlled input as well.
    e.target.reset();
  }

  onChange = (e) => {
    e.preventDefault();
    this.setState({
      title: e.target.value
    });
  }

  onDelete = (e) => {
    axios.delete('http://localhost:4000/', { data: { _id: e } })
    console.log(e);
    // usually wont happen but what if this loop doesnt find the item? what would you do?
    this.state.content.forEach(item => {
      if(item._id === e){
        let newArray = this.state.content
        let index = newArray.indexOf(item)
        newArray.splice(index, 1)
        this.setState({ content: newArray })
      }
    })
  }

  onComplete = (e) => {
    // you usually want to wait for the server response to update the UI. just incase an error occurs.
    // i would put the forEach inside a then
    axios.put('http://localhost:4000/', { _id: e })
    console.log(e);
    this.state.content.forEach(item => {
      if(item._id === e){
        console.log('ID matches')
        let newArray = this.state.content
        let index = newArray.indexOf(item)
        newArray[index].completed = !newArray[index].completed
        this.setState({ content: newArray })
      }
    })
  }

  // i don't know what this is, but thats ok
  handleClick (e) { if (e) {e.preventDefault()}; }
  

  render() {
    return(
      <div className="App">
        <div style={navStyle}>
          <Navbar color="faded" light></Navbar>
            <h2 className="Title">Todo</h2>
        </div>
        <form id="createTodoItem" className="Inputs"onSubmit={this.onSubmit} style={{ display: 'flex', marginBottom: "1rem" }}>
          <InputGroup>
          <Input 
          type="text" 
          name="title"
          onChange={this.onChange}
          style={{flex: '10', padding: '5px' }}
          placeholder="  Add an item..."
          />
            <InputGroupAddon addonType="append">
              <Button 
              onMouseDown={this.handleClick}
              onkeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
              style={navStyle}
              type="submit"
              onSubmit={this.onSubmit}
              >+</Button>
            </InputGroupAddon>
          </InputGroup>
        </form>
        <div className="DBItems">
          <ListGroup>
            {this.state.content.map(item => 
            <ListGroupItem key={item._id}>{item.content}
              <div className="ButtonGroup" style={{ paddingBottom: '2rem' }}>
                <div style={{ position: 'relative', top: '.5rem' }}>
                  <Button
                  onMouseDown={this.handleClick}
                  onkeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
                  onClick={() => this.onDelete(item._id)}
                  close />
                </div>
                <div style={{ paddingRight: '3rem', paddingTop: '.5rem'}}>
                  <Button 
                  onMouseDown={this.handleClick}
                  onkeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
                  class="btn btn"
                  onClick={() => this.onComplete(item._id)}
                  close aria-label="Cancel">
                    <span style={item.completed === true ? { color: "green", fontSize: "17px" } : { color: "black" }}aria-hidden>{item.completed === false ? '-' : "Completed ✓"}</span>
                  </Button>
                </div>
              </div>
            </ListGroupItem>)}
          </ListGroup>
        </div>
      </div>
    );
  }
}

const navStyle = {
  background: "#222222",
  marginBottom: "2rem"
}



export default App;
