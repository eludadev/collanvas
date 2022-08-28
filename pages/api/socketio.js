import { Server } from 'socket.io'
// import { connect, connection, subscriber, publisher } from 'lib/redis'

const ioHandler = async (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)
    // await connect()

    io.on('connection', (socket) => {
      console.log(`New connection: ${socket.id}`)

      socket.on('join', ({ roomKey }) => {
        console.log(`Socket ${socket.id} joined ${roomKey}`)

        // subscriber.subscribe(`drawing.${roomKey}`, (data) => {
        //   const { stroke, socketId } = JSON.parse(data)
        //   if (socket.id !== socketId) {
        //     socket.emit(`drawing.${roomKey}`, stroke)
        //   }
        // })

        // subscriber.subscribe(`message.${roomKey}`, (data) => {
        //   const { message, socketId } = JSON.parse(data)
        //   if (socket.id !== socketId) {
        //     socket.emit(`message.${roomKey}`, message)
        //   }
        // })

        // subscriber.subscribe(`drawingdone.${roomKey}`, (data) => {
        //   const { stroke, socketId } = JSON.parse(data)
        //   if (socket.id !== socketId) {
        //     socket.emit(`drawingdone.${roomKey}`, stroke)
        //   }
        // })

        // subscriber.subscribe(`undo.${roomKey}`, (data) => {
        //   const { socketId } = JSON.parse(data)
        //   if (socket.id !== socketId) {
        //     socket.emit(`undo.${roomKey}`)
        //   }
        // })
      })

      socket.on('message', ({ roomKey, message }) => {
        console.log(`Socket ${socket.id} sent ${message.content} to ${roomKey}`)
        // publisher.publish(
        //   `message.${roomKey}`,
        //   JSON.stringify({ message, socketId: socket.id })
        // )

        // connection.json.arrAppend(`messages:${roomKey}`, '$', message)
      })

      socket.on('drawing', ({ roomKey, stroke }) => {
        // publisher.publish(
        //   `drawing.${roomKey}`,
        //   JSON.stringify({ stroke, socketId: socket.id })
        // )
      })

      socket.on('drawingdone', ({ roomKey, stroke }) => {
        // publisher.publish(
        //   `drawingdone.${roomKey}`,
        //   JSON.stringify({ stroke, socketId: socket.id })
        // )
        // connection.json.arrAppend(`canvas:${roomKey}`, '$', stroke)
      })

      socket.on('undo', ({ roomKey }) => {
        // publisher.publish(
        //   `undo.${roomKey}`,
        //   JSON.stringify({ socketId: socket.id })
        // )
        // connection.json.arrPop(`canvas:${roomKey}`, '$')
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default ioHandler
