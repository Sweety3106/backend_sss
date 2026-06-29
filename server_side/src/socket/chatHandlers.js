const {pool} = require('../config/db')

module.exports = (io, socket) => {
    const {userId, name} = socket.user 

    socket.on('chat:send-message', async ({roomCode, content}) => {
        try {
            if(!content || !content.trim()) return 

            const result = await pool.query(
                `INSERT INTO messages (meeting_id, sender_id, content)
                VALUES (
                (SELECT id FROM meetings WHERE room_code = $1),
                $2, $3
                )
                RETURNING id, sent_at`,
                [roomCode, userId, content.trim()]
            )

            const {id, sent_at} = result.rows[0]


            io.to(roomCode).emit('chat:new-message', {
                id,
                senderId: userId, 
                senderName: name,
                content: content.trim(),
                sentAt: sent_at
            })
        } catch (err) {
            console.error('chat:send-messgae error', err)
            socket.emit('error:server', {message: 'Failed to send message'})
        }        
    })


    socket.on('chat:typing', ({roomCode}) => {
        socket.to(roomCode).emit('chat:user-typing', {
            userId, 
            userName, name
        })
    })

    socket.on('chat:fetch-history', async ({roomCode}) => {
        try {
            const result = await pool.query(
                `SELECT m.id, m.sender_id, u.name as sender_name, m.content, m.sent_at FROM messages m JOIN users U ON m.sender_id = u.id
                JOIN meetings mt ON m.meeting_id = mt.id
                WHERE mt.room_code = $1
                ORDER BY m.sent_at ASC`,
                [roomCode]
                 
            )
            socket.emit('chat:history', {messages: result.rows})
        }catch (err){
            console.error('chat:fetch-history error:', err)
        }
    })

    
}