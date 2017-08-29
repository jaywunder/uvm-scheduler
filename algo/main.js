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
  const graph = Graph()

  const visited = []

  for (let u of courses)
    for (let v of amicable[u])
      graph.addEdge(u, v)
}

function traverse(graph, visited, current) {

}

function consider(graph, visited, node) {
  const adjacent = graph.adjacent(node)

  for (let other of visited)
    if (!adjacent.includes(other)) return false
  return true
}

const courses = [
  makeCourse('A', '8:30', '9:30'),
  makeCourse('B', '9:00', '10:00'),
  makeCourse('C', '12:00', '13:00'),
]

// console.log(findConflicting(courses))
// console.log(findAmicable(courses, findConflicting(courses)))

const conflicts = findConflicting(courses)
const amicable = findAmicable(courses, conflicts)

console.log(buildSchedules(courses, amicable, conflicts))
