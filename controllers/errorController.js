const AppError = require("../utils/appError")

//Handle invalid Database Id function
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`
    return new AppError(message, 404)
}

//Handling Duplicate Database Fields
const handleDuplicateFieldsDB = (err) => {
    const value = JSON.stringify(err.keyValue)
    const message = `Duplicate fields: ${value}. Please use another value`
    return new AppError(message, 400)
}

//handling validation errors from Mongoose
const handleValidatorDB = (err) => {
    // console.log(err.errors)
    const errors = Object.values(err.errors).map((error) => error.message)
    const message = `Invalid input data. ${errors.join('. ')}`

    return new AppError(message, 400); 
}

//Send error for Dev 
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

//Send error for Prod
const sendErrorProd = (err, res) => {
    //Error we are defined ourselves
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.log('Error ✴️🚨', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !',
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    //development error 
    if (process.env.NODE_ENV === 'development') {
       sendErrorDev(err,res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = JSON.parse(JSON.stringify(err))

        ///handle invalid Database ID and
        if (error.name === 'CastError') error = handleCastErrorDB(error)
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'ValidationError') error = handleValidatorDB(error)
        
        //production error
        sendErrorProd(error, res)
    }
}