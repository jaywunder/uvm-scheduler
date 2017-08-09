import React, { Component } from 'react';
import { Spin } from 'antd'
import tower from './assets/uvm_tower.svg'
import CSV from 'comma-separated-values'
import './App.css';

class App extends Component {
  componentWillMount() {
    this.state = {
      courses: null
    }
  }

  componentDidMount() {
    const cors = 'https://cors-anywhere.herokuapp.com/'
    const url = 'giraffe.uvm.edu:443/~rgweb/batch/curr_enroll_fall.txt'
    const s = 'String', n = 'Number', b = 'Boolean'

    fetch(cors+url)
      .then(response => response.text())
      .then(text => {
        this.setState({
          courses: CSV
            .parse(text, {
              cast: [s, s, s, s, s, s, s, s, n, n, s, s, s, n, s, s, s, s, s],
              header: [ 'subject', 'number', 'title', 'courseNumber', 'section', 'lecLab', 'campcode', 'collcode', 'maxEnroll', 'currentEnroll', 'startTime', 'endTime', 'days', 'credits', 'building', 'room', 'instructor', 'netId', 'email']
            })
            .filter((_, i) => i !== 0)
            .filter(course => course.number !== '491')
        })
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img className="App-logo" src={tower}></img>
          <h1>UVM Schedule Maker</h1>
        </div>
        <Spin spinning={!!this.courses}>
          <div className="App-intro">
            { this.state.courses && this.state.courses.map((course, i) =>
              <p key={i}>
                { course.subject } { course.number }{ course.section } { course.title } ({course.courseNumber})
              </p>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

export default App;
