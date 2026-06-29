const dotenv = require("dotenv");
dotenv.config();

const required = [
    'PORT',
    'JWT_SECRET',
    'DATABASE_URL',
    'REDIS_URL',
    'CLIENT_URL'
]

required.forEach((key) => {
    if(!process.env[key]) {
        throw new Error(`Missing required env variable: ${key}`)
    }
})

const env = {
  PORT: Number(process.env.PORT) || 5000,           // this point we can note that process.env values are always strings.
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  TURN_URL: process.env.TURN_URL || '',
  TURN_USERNAME: process.env.TURN_USERNAME || '',
  TURN_CREDENTIAL: process.env.TURN_CREDENTIAL || ''
}

module.exports = env;
