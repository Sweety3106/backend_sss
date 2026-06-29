const {Server} = require('socket.io')
const jwt = require('jsonwebtoken')
const {JWT_SECRET, CLIENT_URL} = require('../config/env')

const signalingHandlers = require('./signalingHandlers')
const chatHandlers = require('./chatHandlers')
const agendaHandlers = require('./agendaHandlers')
const reactionHandlers = require('./reactionHandlers')

let io 
const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin : CLIENT_URL,
            methods: ['GET', 'POST']
        },
        pingTimeout: 60000,
        pingInterval: 25000
    })

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token

        if(!token){
            return next(new Error('Authentication required!!'))
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET)
            socket.user = decoded 
            next()
        }catch(err) {
            return next(new Error('Invalid or expired token'))
        }
    })

    io.on('connection', (socket) => {
        console.log(`socket connected: ${socket.id} | User: ${socket.user.name} (${socket.user.userId})`)
        signalingHandlers(io, socket)
        chatHandlers(io, socket)
        agendaHandlers(io, socket)
        reactionHandlers(io, socket)
    })
    return io
}

const getIO = () => {
    if(!io) throw new Error('Socket.IO not initialized. Call initSocket first')
        return io 
}
module.exports = {initSocket, getIO} 