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

const localURL = 'http://localhost:4000/'

class App extends React.Component {
  state = {
    title: '',
    content: [],
  }

  componentDidMount() {
    axios.get(localURL)
      .then(res => {
        this.setState({ content: res.data })
      })
      .catch(err => console.log(err))
  }

  getItems() {
    axios.get(localURL)
      .then(res => {
        this.setState({ content: res.data })
      })
      .catch(err => console.log(err))
  }

  onSubmit = (e) => {
    e.preventDefault();
    axios.post(localURL, {
      content: this.state.title
    })
    .then(res => {
      let newArray = this.state.content;
      newArray.push(res.data);
      this.setState({ content: newArray });
    })
    e.target.reset();
    this.setState({ title: '' })
  }

  onChange = (e) => {
    e.preventDefault();
    this.setState({
      title: e.target.value
    });
  }

  onDelete = (e) => {
    axios.delete(localURL, { data: { _id: e } })
      .then(res => {
        this.state.content.forEach(item => {
          if (item._id === e){
            let newArray = this.state.content
            let index = newArray.indexOf(item)
            newArray.splice(index, 1)
            this.setState({ content: newArray })
          }
        })
      })
      .catch(err => console.log(err))
  }

  onComplete = (e) => {
    axios.put(localURL, { _id: e })
      .then(data => {
        this.state.content.forEach(item => {
          if(item._id === e){
            let newArray = this.state.content
            let index = newArray.indexOf(item)
            newArray[index].completed = !newArray[index].completed
            this.setState({ content: newArray })
          }
        })
      })
      .catch(err => console.log(err));
  }

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
              onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
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
                  onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
                  onClick={() => this.onDelete(item._id)}
                  close />
                </div>
                <div style={{ paddingRight: '3rem', paddingTop: '.5rem'}}>
                  <Button 
                  onMouseDown={this.handleClick}
                  onKeyUp={(e) => {if (e.keyCode === 13 || e.keyCode === 32){this.handleClick()}}}
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
