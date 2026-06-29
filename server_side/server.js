const http = require('http')
const app = require('./src/app')
const { initSocket} = require('./src/socket')

const {connectDB} = require('./src/config/db')
const {connectRedis} = require('./src/config/redis')

const {PORT} = require('./src/config/env')
const { asyncWrapProviders } = require('async_hooks')

const httpServer = http.createServer(app)

initSocket(httpServer)

;(async () => {
  try {
    await connectDB()
    await connectRedis()

    httpServer.listen(PORT, () => {
        console.log(`
            PANCHAYAT SERVER RUNNING
            PORT: ${PORT}
            ENV: ${process.env.NODE_ENV || 'development'}
            `)
    })
  } catch (err){
    console.error('Failed to start Server:', err)
    process.exit(1)
  }  
})()