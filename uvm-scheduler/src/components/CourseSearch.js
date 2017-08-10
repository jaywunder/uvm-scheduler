import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { subscribe, unsubscribe } from '../util/state'
import fuzzysearch from 'fuzzysearch'
// import './CourseSearch.css'

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
    this.setState({ suggestions }, () => {
      if (this.props.onChange) {
        if (this.hasOneCourse()) this.props.onChange(this.state.suggestions)
        else this.props.onChange([])
      }
    })
  }

  reduceCourses = () =>
    this.state.suggestions.reduce((sum, sugg) =>
      sum.findIndex(elem =>
        elem.subject + elem.number === sugg.subject + sugg.number
      ) > -1
        ? sum
        : sum.concat(sugg)
    ,[])

  hasOneCourse = () => this.reduceCourses().length === 1

  render() {
    const { value, suggestions, courses } = this.state;
    const hasOneCourse = this.hasOneCourse()

    return <div>
      { hasOneCourse && <h3>
        { suggestions[0].subject }&nbsp;
        { suggestions[0].number } &nbsp;
        { suggestions[0].title }
      </h3>}

      <input onChange={this.onQueryChange} type="text" placeholder="Search... i.e. 'CS 120B', 'Adv Programming: C++', or '94803'"></input>

      { !hasOneCourse &&
        <table>
          { this.reduceCourses().map((course, i) => <tr key={i}>
              <td>{ course.subject }</td>
              <td>{ course.number }</td>
              <td>{ course.title }</td>
            </tr>
          )}
        </table>
      }

      { hasOneCourse &&
        <table>
          { this.state.suggestions.map((course, i) =>
            <tr key={i}>
              <td>({course.courseNumber})</td>
              <td>{ course.startTime }-{ course.endTime }</td>
              <td>{ course.currentEnroll } / { course.maxEnroll }</td>
              <td>{ course.days }</td>
              <td>{ course.credits }</td>
              <td>{ course.building }</td>
              <td>{ course.instructor }</td>
              <td>{ course.lecLab }</td>
            </tr>
          )}
        </table>

      }


    </div>
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}
