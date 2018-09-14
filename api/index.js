const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

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

server.listen(3000, () => {
  console.log('Server on 3000')
})

// handlers
const handlers = {}

handlers.sample = (data, callback) => {
  // devolver um status http e um payload
  callback(406, { name: 'Sample Handler' })
}

handlers.notFound = (data, callback) => {
  callback(404)
}

// criando um "request router"
const router = {
  sample: handlers.sample
}
