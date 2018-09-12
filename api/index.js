const http = require('http')
const url = require('url')

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true)

  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  const queryStringObject = parsedUrl.query

  const method = req.method.toLowerCase()

  const headers = req.headers

  res.end('hello world!\n')

  console.log(`${method} > Request received on: ${trimmedPath} | query: ${JSON.stringify(queryStringObject)} | headers: ${JSON.stringify(headers)}`)
})

server.listen(3000, () => {
  console.log('Server on 3000')
})
