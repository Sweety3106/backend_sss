module.exports = (io, socket) => {
    const {userId, name} = socket.user 

const ALLOWED_EMOJIS = ['👍', '❤️', '😂', '😮', '👏', '🎉','💐', '🌸', '💮', '🪷', '🏵️', '🌹', '🌺', '🌻', '🌼', '🌷', '🪻', '⚘']

socket.on('reaction:send', ({roomCode, emoji}) => {
    if(!ALLOWED_EMOJIS.includes(emoji)) {
        socket.emit('error:validation', {message: 'Invalid emoji'})
        return 
    }


io.to(roomCode).emit('reaction:received', {
    userId, 
    userName: name,

    emoji,
    timestamp: Date.now()
})
})
}