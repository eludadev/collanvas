import { createServer } from 'http'
import { parse } from 'url'
import { Server } from 'socket.io'
import next from 'next'
import { connection, publisher, subscriber } from './redis.mjs'

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

  const io = new Server(server)

  // socket.io server
  io.on('connection', (socket) => {
    socket.on('join', ({ roomKey }) => {
      console.log(`Socket ${socket.id} joined ${roomKey}`)

      subscriber.subscribe(`drawing.${roomKey}`, (data) => {
        const { stroke, socketId } = JSON.parse(data)
        if (socket.id !== socketId) {
          socket.emit(`drawing.${roomKey}`, stroke)
        }
      })

      subscriber.subscribe(`message.${roomKey}`, (data) => {
        const { message, socketId } = JSON.parse(data)
        if (socket.id !== socketId) {
          socket.emit(`message.${roomKey}`, message)
        }
      })

      subscriber.subscribe(`drawingdone.${roomKey}`, (data) => {
        const { stroke, socketId } = JSON.parse(data)
        if (socket.id !== socketId) {
          socket.emit(`drawingdone.${roomKey}`, stroke)
        }
      })

      subscriber.subscribe(`undo.${roomKey}`, (data) => {
        const { socketId } = JSON.parse(data)
        if (socket.id !== socketId) {
          socket.emit(`undo.${roomKey}`)
        }
      })
    })

    socket.on('message', ({ roomKey, message }) => {
      publisher.publish(
        `message.${roomKey}`,
        JSON.stringify({ message, socketId: socket.id })
      )

      connection.json.arrAppend(`messages:${roomKey}`, '$', message)
    })

    socket.on('drawing', ({ roomKey, stroke }) => {
      publisher.publish(
        `drawing.${roomKey}`,
        JSON.stringify({ stroke, socketId: socket.id })
      )
    })

    socket.on('drawingdone', ({ roomKey, stroke }) => {
      publisher.publish(
        `drawingdone.${roomKey}`,
        JSON.stringify({ stroke, socketId: socket.id })
      )

      connection.json.arrAppend(`canvas:${roomKey}`, '$', stroke)
    })

    socket.on('undo', ({ roomKey }) => {
      publisher.publish(
        `undo.${roomKey}`,
        JSON.stringify({ socketId: socket.id })
      )

      connection.json.arrPop(`canvas:${roomKey}`, '$')
    })
  })
})
