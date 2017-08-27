import React, { Component } from 'react';
import PropTypes from 'prop-types'
import BigCalendar from 'react-big-calendar'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import moment from 'moment'

import tower from './assets/uvm_tower.svg'
import { subscribe, unsubscribe } from './util/state'
import CourseSearch from './components/CourseSearch'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css';

const colors = ['rgb(64,164,216)','rgb(50,190,180)','rgb(180,195,30)','rgb(255,205,50)','rgb(250,260,40)','rgb(245,100,30)','rgb(220,60,55)','rgb(240,100,120)','rgb(165,100,215)']

class App extends Component {
  componentWillMount() {
    const state = this.context.store.getState()
    this.state = {
      courses: state.courses,
      events: [],
      courseSearches: []
    }

    this.addCourseSearch()
  }

  componentDidMount() {
    this.unsubscribeStore = subscribe(this)('courses')
  }

  componentWillUnmount() { unsubscribe(this) }

  addCourseSearch = () =>
    this.setState(({ courseSearches }) => ({
      courseSearches: courseSearches.concat(
        <CourseSearch
          key={courseSearches.length}
          onChange={ this.onQueryChange(courseSearches.length) }
          onDelete={ this.onDeleteCourseSearch(courseSearches.length) }
          onHasOneCourse={this.addCourseSearch}
        />
      )
    }))

  onDeleteCourseSearch = i => () =>
    this.setState(({ courseSearches, events }) => {
      const newCourseSearches = courseSearches.concat()
      newCourseSearches.splice(i, 1, null)
      return { courseSearches: newCourseSearches }
    })

  onQueryChange = i => courses =>
    this.setState(({ events }) => {
      const newEvents = events.concat()
      newEvents.splice(i, 1, this.coursesToEvents(courses, i))
      return { events: newEvents }
    })

  coursesToEvents(courses, index) {
    const baseTime = moment().startOf('week')
    const days = { M: 1, T: 2, W: 3, R: 4, F: 5, S: 6 }
    const events = []

    for (let course of courses) {
      for (let day of course.days) {
        if (day === ' ') continue

        const time = baseTime.clone().add(days[day], 'days')
        const start = course.startTime.split(':').map(n => parseInt(n))
        const end = course.endTime.split(':').map(n => parseInt(n))

        events.push({
          title: course.subjNumSec.toUpperCase(),
          start: time.clone().hour(start[0]).minute(start[1]).second(0).toDate(),
          end: time.clone().hour(end[0]).minute(end[1]).second(0).toDate(),
          color: colors[(index + 1) % colors.length]
        })
      }
    }

    return events
  }

  render() {
    const events = this.state.events.reduce((sum, arr) => arr ? sum.concat(arr) : sum, [])

    return (
      <div className="App">
        <div className="header util vertical-center">
          <img className="logo" src={tower}></img>
          <h1>UVM Schedule Maker</h1>
        </div>
        <div className="calendar">
          <BigCalendar
            min={moment().hour(8).minute(0).second(0).toDate()}
            max={moment().hour(21).minute(0).second(0).toDate()}
            view="week"
            onView={()=>{}}
            toolbar={false}
            events={events}
            eventPropGetter={event => ({
              style: { background: event.color, outline: '0px solid rgba(0,0,0,0)' }
            })}
            formats={{
              dayHeaderFormat() { return '' },
              dayFormat() { return '' },
            }}
          />
        </div>
        <div className="queries">
          { this.state.courseSearches.map(elem => elem )}
          {/* <button onClick={this.addCourseSearch}>+</button> */}
        </div>
      </div>
    );
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}

export default App;
