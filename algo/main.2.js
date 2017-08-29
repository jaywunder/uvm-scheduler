const Graph = require("graph-data-structure")

const timeToScalar = time => time.split(':')
  .map(n => parseInt(n))
  .reduce((sum, elem, i) => i === 0 ? sum + elem * 60 : sum + elem, 0)

const scalarToTime = scalar => [Math.floor(scalar / 60), scalar % 60]
  .map(n => n + '').join(':')

const makeCourse = (name, inTime, outTime) => ({
  name,
  crn: 90000 + Math.floor(Math.random() * 9999) + '',
  inTime: timeToScalar(inTime),
  outTime: timeToScalar(outTime),
  toString() { return `${this.name} (${this.crn})` }
})

const setDifference = (A, B) => {
    const difference = new Set(A)
    for (const elem of B) {
        difference.delete(elem)
    }
    return difference
}

function findConflicting(courses) {
  const conflicts = {}

  for (let i in courses) { const target = courses[i]
    const store = conflicts[target] = []

    for (let j in courses) { const compare = courses[j]
      if (i === j) continue

      if (
        (target.inTime > compare.inTime && target.inTime < compare.outTime) ||
        (target.outTime > compare.inTime && target.outTime < compare.outTime)
      ) store.push(compare)
    }
  }

  return conflicts
}

function findAmicable (courses, conflicts) {
  const amicable = {}

  for (let i in courses) { const target = courses[i]
    const store = amicable[target] = []

    for (let j in courses) { const compare = courses[j]
      if (i === j) continue

      if (!conflicts[target].includes(compare))
        // store.push(compare)
        store.push(compare.toString())
    }
  }

  return amicable
}

function buildSchedules(courses, amicable, conflicting) {
  let paths = []

  for (let course of courses)
    paths.push(traverse(
      amicable, course.toString(), 5, [], paths
    ))

  return paths
}

function traverse(amicable, current, maxLength, visited, paths) {
  visited = visited.concat(current)

  if (maxLength === visited.length) {
    paths.push(visited)
    return
  }

  let done = true
  for (let node of amicable[current]) {
    if (consider(amicable, visited, node)) {
      done = false
      traverse(amicable, node, maxLength, visited, paths)
    }
  }

  if (done) paths.push(visited)
}

function consider(amicable, visited, current) {
  const adjacent = amicable[current]

  for (let other of visited)
    if (!adjacent.includes(other)) return false
  return true
}

const courses = [
  makeCourse('A', '8:30', '9:30'),
  makeCourse('B', '9:00', '10:00'),
  makeCourse('C', '12:00', '13:00'),
  makeCourse('D', '12:30', '13:30'),
  makeCourse('F', '14:30', '16:30'),
]

// console.log(findConflicting(courses))
// console.log(findAmicable(courses, findConflicting(courses)))

const conflicts = findConflicting(courses)
const amicable = findAmicable(courses, conflicts)

console.log(buildSchedules(courses, amicable, conflicts))
