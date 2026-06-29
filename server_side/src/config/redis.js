const {createClient} = require('redis')
const {REDIS_URL} = require('./env')

const redisClient = createClient({
    url: REDIS_URL
})

redisClient.on('error', (err) => {
    console.error('Redis client error:', err.message)
})

const connectRedis = async () => {
    try {
        await redisClient.connect()
        console.log('Redis connected Successfully')
    } catch (err) {
        console.error('Redis connection failed:', err.message)
        process.exit(1)
    }
}

module.exports = {redisClient, connectRedis}
