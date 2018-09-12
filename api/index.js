const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')
  res.end('hello world!\n')
  console.log(`Request received on: ${trimmedPath}`)
})

server.listen(3000, () => {
  console.log('Server on 3000')
})
