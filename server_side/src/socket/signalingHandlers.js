const { Socket } = require('socket.io')
const roomManager = require('./reactionHandlers') 

module.exports = (io, socket) => {
    const {userId, name} = socket.user

    socket.on('room:join', async ({roomCode, userName}) => {
        try {

            socket.join(roomCode)

            await roomManager.addParticipant(roomCode, userId, {
                userName, 
                socketId: socket.id,
                isMuted: false,
                isCameraOff: false,
                isHost: false       
            })
            const participants = await roomManager.getParticipants(roomCode)
            socket.emit('room:participants', {participants})
            socket.io(roomCode).emit('room:user-joined', {
                userId,
                userName,
                isHost: false
            })
            console.log(`User ${userName} joined room ${roomCode}`)

        }catch (err) {
            console.error('room:join error:', err)
            socket.emit('error:server', {message: 'Failed to join room'})
        }

})

socket.on('room:leave', async ({roomCode}) => {
    try {
        await roomManager.removeParticipant(roomCode, userId)
        socket.leave(roomCode)
        socket.to(roomCode).emit('room:user-left', {userId, userName: name})
        console.log(`User ${name} left room ${roomCode}`)
    }catch (err) {
        console.error('room:leave error', err)
    }
})
socket.on('webrtc:offer', async ({toUserId, sdp}) => {
    try {
        const targetSocketId = await roomManager.getSocketId(
            [...socket.rooms].find(r => r !== socket.id), toUserId
        )
        if(!targetSocketId) {
            console.warn(`webrtc:offer: target user ${toUserId} not found`)
            return 
        }
        io.to(targetSocketId).emit('webrtc:offer', {
            fromUserId: userId,
            sdp
        })
    } catch (err) {
        console.error('webrtc:offer error', err)
    }
})

socket.on('webrtc:answer', async ({toUserId, sdp}) => {
    try {
        const roomCode = [...socket.rooms].find(r => r !== socket.id)
        const targetSocketId = await
    }  
})
}