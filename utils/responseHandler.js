const { configDotenv } = require("dotenv");

function propagateResponse(message, data, successCode, statusCode ) {
    return {
        statusCode,
        success: true,
        message,
        successCode,
        data
    };
}

function propagateError(statusCode, errorCode, message) {
    return {
        statusCode,
        errorCode,
        success: false,
        message
    };
}  

module.exports = { propagateResponse, propagateError };