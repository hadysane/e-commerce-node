//name, email, photo, password, passwordConfirm = user
const mongoose = require('mongoose')

const validator = require('validator')

const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please tell us your name']
    }, 
    email: {
        type: String,
        require: [true, 'Please provide your email'], 
        unique: true,
        lowercase: true, 
        validate: [validator.isEmail, 'Please provide a valid email']
    },  
    photo: String,
    password:{
        type: String,
        required:[true, 'Please provide your password'], 
        minlength: 6, 
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide your password'],
        
    }
})

userSchema.pre('save', async function (next) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, 12)

    //Delete the passwordConfirm field
    this.passwordConfirm = undefined

    next()
})


userSchema.methods.correctPassword = async function (
    passwordEntered,
    userPassword
) {
    return await bcrypt.compare(passwordEntered, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User