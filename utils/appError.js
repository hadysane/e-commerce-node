class AppError extends Error {
    constructor(message, statusCode) {
        super(message); 

        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'; 
        this.isOperational = true; // IS NOT A LIBRARY

        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = AppError; 