const jwt = require('jsonwebtoken')
const User = require('../models/useModal')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

// CREATE A JWT Token

const createJWTToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN, 
    })
}

exports.signup = catchAsync(async(req, res, next) => {
    const user = await User.create(req.body)

    const token = createJWTToken(user._id)

    res.status(201).json({ status: 'success', token, data: { user } })
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    // } )
    
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body; 

    //1) Check if email and password provided

    if (!email || !password)
        return next(new AppError('Please provide a valid email and password', 400))
    
    // 2) Check if email and password user is correct
    const user = await User.findOne({ email }).select('+password')
    const correct = user.correctPassword(password, user.password)

    if (!user || !correct)
        return next(AppError('Incorrect email or password', 401))
    // 3) If everything is correct, sen token to client 💻 👩‍🦱
    const token = createJWTToken(user._id)
    res.status(200).json({
        status: 'success', 
        token, 
        data: {
            user, 
        }
    })

})

exports.protect = catchAsync(async (req, res, next) => {
    console.log(req.headers)
    // 1) Getting token and check of it's here

    // 2) verification Token

    // 3) check if user still exists
    
    next()
})