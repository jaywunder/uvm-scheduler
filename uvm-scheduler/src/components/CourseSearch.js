import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-collapse'
import fuzzysearch from 'fuzzysearch'
import { subscribe, unsubscribe } from '../util/state'
import Course from './Course'
import Toggle from './util/Toggle'
import Delete from './util/Delete'
import './CourseSearch.css'

export default class CourseSearch extends Component {
  componentWillMount() {
    const state = this.context.store.getState()
    this.state = {
      enabled: true,
      collapsed: false,
      value: '',
      courses: state.courses,
      sectionStates: [],
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
      return courses.filter(course => course.subjNumSec.startsWith(search))
    else if (isTitle)
      return courses.filter(course => fuzzysearch(search, course.title.toLowerCase()))
    else return []
  }

  onQueryChange = event => {
    const suggestions = this.getSuggestions(event.target.value)
    const sectionStates = suggestions.map(() => true)
    this.setState({ suggestions, sectionStates }, () => {
      if (this.hasOneCourse()) {
        (this.props.onChange && this.props.onChange(this.state.suggestions));
        (this.props.onHasOneCourse && this.props.onHasOneCourse());
      } else this.props.onChange([])
    })
  }

  onAllToggle = () => this.setState(({ enabled }) => {
    if (enabled) this.props.onChange([])
    else this.props.onChange(this.state.suggestions)
    return { enabled: !enabled }
  })

  onSectionToggle = i => () =>
    this.setState(({ sectionStates }) => ({
      sectionStates: sectionStates.map((state, j) => i === j ? !state : state)
    }), () => this.props.onChange(
      this.state.suggestions.filter((_, i) => this.state.sectionStates[i])
    ))

  reduceCourses = () =>
    this.state.suggestions.reduce((sum, sugg) =>
      sum.findIndex(elem =>
        elem.subject + elem.number === sugg.subject + sugg.number
      ) > -1
        ? sum
        : sum.concat(sugg)
    ,[])

  hasOneCourse = () => this.reduceCourses().length === 1

  onCollapseToggle = () =>
    this.setState( ({collapsed}) => ({ collapsed: !collapsed }) )

  render() {
    const { value, suggestions, courses } = this.state;
    const hasOneCourse = this.hasOneCourse()

    return <div className="CourseSearch">
      { !hasOneCourse && <div>
        <input
          className="search-input"
          onChange={this.onQueryChange}
          type="text"
          placeholder="Search... i.e. 'CS 120B', 'Adv Programming: C++', or '94803'"
        ></input>
        <table>
          { this.reduceCourses().map((course, i) => <tr key={i}>
              <td>{ course.subject }</td>
              <td>{ course.number }</td>
              <td>{ course.title }</td>
            </tr>
          )}
        </table>
      </div>}

      { hasOneCourse && <div>
        <div className="util vertical-center">
          <Toggle state={this.state.enabled} onToggle={this.onAllToggle}/>
          <Delete onDelete={this.props.onDelete}/>
          <h4 className="title">
            { suggestions[0].subject }&nbsp;{ suggestions[0].number }&nbsp;{ suggestions[0].title }
          </h4>
        </div>
        <Collapse isOpened={true && this.state.enabled}>
          { this.state.suggestions.map((course, i) => <div className="indent">
            <Toggle
              state={this.state.sectionStates[i]}
              onToggle={this.onSectionToggle(i)}
            />
            <Course course={course}/>
          </div>)}
        </Collapse>
      </div>}
    </div>
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}
