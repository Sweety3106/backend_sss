const { errorResponse} = require('../utils/apiResponse')

const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        url: req.url,
        method: req.method,

    })

    const cod = err.code || 'Internal Error'

    const message = err.message || 'Bhai muje khuch shi nhi lg rha he'

    const status = err.status || 500

    return errorResponse(res, code, message, status)
}

mmodule.exports = errorHandler