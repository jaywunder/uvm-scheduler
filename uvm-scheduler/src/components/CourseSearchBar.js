import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest';
import { subscribe, unsubscribe } from '../util/state'
import fuzzysearch from 'fuzzysearch'
import './CourseSearchBar.css'

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

  getSuggestions(value) {
    if (!this.state.courses || value === '' || !value) return []

    return this.state.courses
      .filter(course => fuzzysearch(value, course.searchText))
  }

  getSuggestionValue = suggestion =>
    `${ suggestion.subject } ${ suggestion.number }${ suggestion.section } ${ suggestion.title } ${suggestion.courseNumber}`

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    })

    // const isSelected = user => user.username === newValue
    // const index = this.state.userList.findIndex(isSelected)
    //
    // // I'm not sure how to create a SyntheticEvent so
    // // this is how it's going to work for now
    // const returnEvent = { target: { type: 'searchbar' }}
    // returnEvent.target.value = index > -1
    //   ? this.state.userList[index].id
    //   : null
    // console.log('returnEvent', returnEvent)
    // this.props.onChange(returnEvent)
  }

  onSuggestionsFetchRequested = ({ value }) =>
    this.setState({ suggestions: this.getSuggestions(value) })

  onSuggestionsClearRequested = () =>
    this.setState({ suggestions: [] })

  renderSuggestion = (suggestion, { isHighlighted, query }) => {
    return <span>{ suggestion.subject } { suggestion.number }{ suggestion.section } { suggestion.title } ({suggestion.courseNumber})</span>
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "Search courses...",
      value,
      onChange: this.onChange
    }

    return (
      <Autosuggest
        inputProps={inputProps}
        suggestions={suggestions}
        renderSuggestion={this.renderSuggestion}
        getSuggestionValue={this.getSuggestionValue}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
      />
    )
  }

  static contextTypes = {
    store: PropTypes.object,
  }
}
