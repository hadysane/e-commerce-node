//Express
const express = require('express');
const app = express() // lancer le application express
//Morgan
const morgan = require('morgan');
//dotenv
const dotenv = require('dotenv')

//AppError
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController')


//Env config
dotenv.config()

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
}


// allow us to use request body (middleware)
app.use(express.json())

// app.use((req, res, next) => {
//     console.log('Hello from Middleware'); 
//     next(); 
// })



const productRouter = require('./routes/productRoutes'); 
const userRouter = require('./routes/userRoutes');

app.use('/api/v1/products', productRouter)
app.use('/api/v1/users', userRouter)

// erreur 404 
app.all('*', (req, res, next) => {

    next(new AppError(`can't find ${req.originalUrl} on this server`, 404))
})

app.use(globalErrorHandler)

module.exports = app; 