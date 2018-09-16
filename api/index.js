const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')
const fs = require('fs')

const httpServer = http.createServer(unifiedServer)
httpServer.listen(config.httpPort, () => {
  console.log(`Server on port ${config.httpPort} in environment ${config.envName}...`)
})

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(
  httpsServerOptions,
  unifiedServer
)
httpsServer.listen(config.httpsPort, () => {
  console.log(`Server on port ${config.httpsPort} in environment ${config.envName}...`)
})

function unifiedServer (req, res) {
  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  const queryStringObject = parsedUrl.query

  const method = req.method.toLowerCase()

  const headers = req.headers

  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', data => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    const data = {
      trimmedPath,
      method,
      queryStringObject,
      headers,
      payload: buffer
    }

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200

      payload = typeof (payload) === 'object' ? payload : {}

      const payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })
  })
}

const handlers = {}

handlers.notFound = (data, callback) => {
  const statusCode = 404
  callback(statusCode)
}

handlers.ping = (data, callback) => {
  const statusCode = 200
  callback(statusCode)
}

const router = {
  ping: handlers.ping
}
