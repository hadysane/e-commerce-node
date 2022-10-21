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

// ─── Signup ──────────────────────────────────────────────────────────────────

exports.signup = catchAsync(async(req, res, next) => {
    const user = await User.create(req.body)

    const token = createJWTToken(user._id)

    res.status(201).json({ status: 'success', token, data: { user } })
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRES_IN,
    // } )
    
})

// ─── Login ───────────────────────────────────────────────────────────────────

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

// ─── Protect ─────────────────────────────────────────────────────────────────

exports.protect = catchAsync(async (req, res, next) => {
    // console.log(req.headers)

    // 1) Getting token and check of it's here
    let token; 
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; 
        // console.log(token)
    }

    if (!token)
        return next(
            new AppError('You are logged in! Please log in to get access', 401)
        )

    // 2) verification Token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3) check if user still exists

    const currentUser = await User.findById(decoded.id)
    if (!currentUser)
        return next(
            new AppError('The user belongs to this token does not exist', 401)
        )

    // 4) Check if user changed password after the token was issued 
    // console.log(decoded.iat)
    if (currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError('User recently changed password ! Please log in again', 401))


    // 5) If everything is correct, send user to req.user
    req.user = currentUser;

    next()
})
// ─── Restuction By Roles ─────────────────────────────────────────────────────

exports.restrictTo = (...roles) => {
    
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // console.log('You are allowed to access this route')
            return next(new AppError('You do not have permission to perform this action', 403))
        } 
        next(); 
    }
}