const { statSync } = require("fs")

const successResponse = (res, data, status = 200) => {
    return res.status(status).json({
        success: true,
        data
    })
}

const errorResponse = (res, errorCode, message, status = 500) => {
    return res.status(status).json({
        success: false,
        error: errorCode,
        message
    })
}

module.exports = {successResponse, errorResponse}