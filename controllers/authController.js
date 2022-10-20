const User = require('../models/useModal')
const catchAsync = require('../utils/catchAsync')

exports.signup = catchAsync(async(req, res, next) => {
    // 1) Create a user using 

    const user = await User.create(req.body)
    res.status(201).json({ status: 'success', data: { user } })
})