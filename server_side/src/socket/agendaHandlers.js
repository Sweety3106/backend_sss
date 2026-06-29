const { rmSync } = require('fs')
const {pool} = require('../config//db')

module.exports = (io, socket) => {
    const {userId, name} = socket.user

    socket.on('agenda:fetch', async ({roomCode}) => {
        try {
            const result = await pool.query(
                `SELECT a.content, a.updated_at, u.name as updated_by_name FROM agendas a LEFT JOIN users u ON a.last_updated_by = u.id JOIN meetings m ON a.meeting_id = m.id WHERE m.room_code = $1`, [roomCode

                ]
            )
            const agenda = result.rows[0] || {content: '', updated_by_name:null, updated_at:null}
            socket.emit('agenda:current', {agenda})
        }catch(err) {
            console.error('agenda:fetch error:', err)
        }        
    })

    socket.on('agenda:save', async ({roomCode, content}) => {
            try{
                await pool.query(
                    `INSERT INTO agenda (meeting_id, content, last_updated_by, updated_at)
                    VALUES (
                    (SELECT id FROM meetings WHERE room_code = $1), $2, $3, NOW()
                    )
                    ON CONFLICT (meeting_id)
                    DO UPDATE SET
                        content = EXCLUDED.content,
                        last_updated_by = EXCLUDED.last_updated_by,
                        updated_at = NOW()`,
                        [roomCode, content, userId]
                )
                io.to(roomCode).emit('agenda:updated', {
                    content,
                    updatedBy: name, 
                    updatedAt: new Date().toISOString()
                })
            } catch (err){
                console.error('agenda:save error', err)
            }       
    })
}