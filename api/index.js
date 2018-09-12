const http = require('http')

const server = http.createServer((req, res) => {
  res.end('Server on!\n')
})

server.listen(3000, () => {
  console.log('Server on 3000')
})
