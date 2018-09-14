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
    res.end('Hello World!\n')
    console.log(`
    
    trimmedPath         => ${trimmedPath}
    queryStringObject   => ${JSON.stringify(queryStringObject)}
    method              => ${method}
    headers             => ${JSON.stringify(headers).substr(0, 90)}[...]
    buffer              => ${buffer}
    `)
  })
})

server.listen(3000, () => {
  console.log('Server on 3000')
})
