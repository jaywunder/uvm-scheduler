import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import tower from './assets/uvm_tower.svg'
import { subscribe, unsubscribe } from './util/state'
import CourseSearchBar from './components/CourseSearchBar'
import CourseSearch from './components/CourseSearch'
import './App.css';

class App extends Component {
  componentWillMount() {
    this.state = {
      courses: null
    }
  }

  componentDidMount() {
    this.unsubscribeStore = subscribe(this)('courses')
  }

  componentWillUnmount() { unsubscribe(this) }

  render() {
    return (
      <div className="App">
        <div className="App-header">
            <img className="App-logo" src={tower}></img>
          <h1>UVM Schedule Maker</h1>
        </div>
        <div className="App-intro">
          <CourseSearch/>

          {/* { this.state.courses && this.state.courses.map((course, i) =>
            <p key={i}>
              { course.subject } { course.number }{ course.section } { course.title } ({course.courseNumber})
            </p>
          )} */}
        </div>
      </div>
    );
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}

export default App;
