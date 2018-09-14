const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const config = require('./config')

const server = http.createServer((req, res) => {
  // obtém a URL parseada
  const parsedUrl = url.parse(req.url, true)

  // obtém o 'path' da requisição (p.ex: 'empresa/funcionarios')
  const path = parsedUrl.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // obtém a query string como um objeto
  const queryStringObject = parsedUrl.query

  // obtém o método da requisição
  const method = req.method.toLowerCase()

  // obtém os headers da requisição
  const headers = req.headers

  // obtém o payload (corpo da requisição), se houver um
  const decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', data => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()
    // define qual handler deve ser utilizado
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    // constrói os dados que serão passados para o handler escolhido
    const data = {
      trimmedPath,
      method,
      queryStringObject,
      headers,
      payload: buffer
    }

    chosenHandler(data, (statusCode, payload) => {
      // statusCode padrão
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200

      // payload padrão
      payload = typeof (payload) === 'object' ? payload : {}

      // stringify payload
      const payloadString = JSON.stringify(payload)

      // retorna a resposta
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
    })
  })
})

server.listen(config.port, () => {
  console.log(`Server on port ${config.port} in environment ${config.envName}...`)
})

// handlers
const handlers = {}

handlers.sample = (data, callback) => {
  const payload = { name: 'Sample Handler' }
  const statusCode = 406
  // devolver um status http e um payload
  callback(statusCode, payload)
}

handlers.notFound = (data, callback) => {
  const statusCode = 404
  callback(statusCode)
}

// criando um "request router"
const router = {
  sample: handlers.sample
}
