(async function() {
  const response = await fetch('https://giraffe.uvm.edu/~rgweb/batch/curr_enroll_fall.txt')
  console.log('response', response)
})()
