const {Pool} = require('pg')
const {DATABASE_URL} = require('./env')

const pool= new Pool({
    connectionString: DATABASE_URL,
    ssl: {rejectUnauthorized: false}
})

const connectDB = async () => {
    try {
        await pool.query('SELECT 1')
        console.log('PostgreSQL connected successfully')
    } catch (err) {
        console.error('PostgreSQL connection failed:', err.message)
        process.exit(1)
    }
}

module.exports = {pool, connectDB}