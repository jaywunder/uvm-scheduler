import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Course.css'

export default ({ course }) => {
  const seats = course.maxEnroll - course.currentEnroll
  const instructor = course.instructor.split(',')
    .map(s => s.trim())
    .reverse()
    .join(' ')

  return <div className="Course">
    Section {course.section} &nbsp; ({course.courseNumber}) &nbsp;<br/>
    <div className="indent">
      { course.startTime }-{ course.endTime } &nbsp; { course.days }<br/>
      { seats } seat{seats !== 1 && 's'} left<br/>
      { course.credits } credit{ course.credits !== 1 && 's' }<br/>
      { course.building }<br/>
      { instructor }
    </div>
  </div>
}
