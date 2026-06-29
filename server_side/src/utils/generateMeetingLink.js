const {CLIENT_URL} = require('../config/env')

const generatemeetingLink = (roomCode) => {

    return `${CLIENT_URL}/meeting/${roomCode}`
}

module.exports = generatemeetingLink