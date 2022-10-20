const User = require("../models/useModal");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

//----------controller users----------
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find()
    res.status(200).json({
        status: 'success', 
        results: users.length,
        data: {
            users,
        }
    });
});


exports.getUser = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) return next(new AppError('No user found with this Id !', 404))

    res.status(200).json({
        status: 'success', 
        data:{user} 
    });


});

exports.createUser = (req, res) => {
    res.status(201)
        .json({ status: 'success' });
};

exports.updateUser = (req, res) => {
    res
        .status(200)
        .json({ status: 'success', data: { user: '<Update user>' } });
};

exports.deleteUser = (req, res) => {
    res.status(204).json({ status: 'success', data: null });
};