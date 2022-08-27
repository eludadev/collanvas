const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })

  const io = require('socket.io')(server)

  // socket.io server
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`)

    socket.on('message', ({ roomKey, message }) => {
      // TODO: use Redis PubSub
      socket.broadcast.emit(`message.${roomKey}`, message)

      // TODO: add message to DB
    })

    socket.on('drawing', ({ roomKey, stroke }) => {
      // TODO: use Redis PubSub
      socket.broadcast.emit(`drawing.${roomKey}`, stroke)
    })

    socket.on('drawingdone', ({ roomKey, stroke }) => {
      // TODO: add stroke to DB
      socket.broadcast.emit(`drawingdone.${roomKey}`, stroke)
    })

    socket.on('undo', ({ roomKey }) => {
      socket.broadcast.emit(`undo.${roomKey}`)
    })
  })
})
