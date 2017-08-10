import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest';
import { subscribe, unsubscribe } from '../util/state'
import fuzzysearch from 'fuzzysearch'
import './CourseSearchBar.css'

// ;['cs', 'cs120', 'cs120aa']
//   .map(s => s.match(searches.subjectNumberSection))
//   .map(s => console.log('hey', s))

export default class CourseSearchBar extends Component {
  componentWillMount() {
    const state = this.context.store.getState()
    this.state = {
      value: '',
      courses: state.courses,
      suggestions: []
    }
  }

  componentDidMount() {
    this.unsubscribeStore = subscribe(this)('courses')
  }

  componentWillUnmount() { unsubscribe(this) }

  getSuggestions(search) {
    if (!this.state.courses || search === '' || !search || search.length <= 2) return []
    const courses = this.state.courses
    const searches = {
      courseNumber: /^\d{5}$/,
      subjNumSec: /^[a-z]{2,4}\d{0,3}[a-z0-9]{0,3}$/,
      title: /^.*$/,
    }

    search = search.trim()
      .toLowerCase()
      .replace(/ /g, '')

    const isCourseNumber = !!search.match(searches.courseNumber)
    const isSubjNumSec = !!search.match(searches.subjNumSec)
    const isTitle = !!search.match(searches.title)

    if (isCourseNumber)
      return courses.filter(course => search === course.courseNumber)
    else if (isSubjNumSec)
      // return courses.filter(course => fuzzysearch(search, course.subjNumSec))
      return courses.filter(course => course.subjNumSec.startsWith(search))
    else if (isTitle)
      return courses.filter(course => fuzzysearch(search, course.title.toLowerCase()))
    else return []
  }

  renderSuggestion = suggestion => {
    return <span>{ suggestion.subject } { suggestion.number }{ suggestion.section } { suggestion.title } ({suggestion.courseNumber})</span>
  }

  onQueryChange = event => {
    const suggestions = this.getSuggestions(event.target.value)
    this.setState({ suggestions }, () =>
      this.props.onChange ? this.props.onChange(suggestions) : null
    )
  }

  render() {
    const { value, suggestions } = this.state;

    return <div>
      <input onChange={this.onQueryChange} type="text" placeholder="Search... i.e. 'CS 120B', 'Adv Programming: C++', or '94803'"></input>
      {/* { this.state.suggestions.map((course, i) =>
        <p key={i}> */}
          {/* { course.searchText } */}
          {/* { this.renderSuggestion(course) } */}
          {/* { course.text } */}
          {/* { course.subject } { course.number }{ course.section } { course.title } ({course.courseNumber})
          { course.startTime }-{ course.endTime } {course.lecLab} */}
        {/* </p>
      )} */}
      <table>
        {this.state.suggestions.length > 0 && <thead>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>curr</td>
          <td>max</td>
        </thead>}
        { this.state.suggestions.map((course, i) =>
          <tr key={i}>
            <td>{ course.subject }</td>
            <td>{ course.number }{ course.section }</td>
            <td>{ course.title }</td>
            <td>({course.courseNumber})</td>
            <td>{ course.startTime }-{ course.endTime }</td>
            <td>{ course.maxEnroll }</td>
            <td>{ course.currentEnroll }</td>
            <td>{ course.days }</td>
            <td>{ course.credits }</td>
            <td>{ course.building }</td>
            <td>{ course.instructor }</td>
            <td>{ course.lecLab }</td>
          </tr>
        )}
      </table>

    </div>
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}
