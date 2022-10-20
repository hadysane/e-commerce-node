const catchAsync = (fn) => {
    return function (req, res, next) {
        //fn exemple: function createProduct
        fn(req, res, next).catch(err => next(err))
    }
}

module.exports = catchAsync; 