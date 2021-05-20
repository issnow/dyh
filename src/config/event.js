var EventEmitter = require('events')

var ee = new EventEmitter()
export default ee

// ee.on('message', function (text) {
//   console.log(text)
// })
// ee.emit('message', 'hello world')