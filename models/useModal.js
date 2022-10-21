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
    role: {
        type: String,
        enum: ['user', 'admin', 'employee'], 
        default: 'user', 
    }, 
    password:{
        type: String,
        required:[true, 'Please provide your password'], 
        minlength: 6, 
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide your password'],
        
    }, 
    passwordChangedAt: Date
})

// ─── Check Password Entered By The User Is Correct ───────────────────────────

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


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        /*
            Si la date (time) de creation de JWT est INFERIEUR
            à celui de changedTimestamp(créer quand utilisateur change son mot de passe )
            return true = le token de JWT a été déjà utiliser
        */
        

        //JWTTimestamp < changedTimestamp 
        console.log(changedTimestamp, JWTTimestamp); 

        return JWTTimestamp < changedTimestamp
        // true = JWTTimestamp a été déjà utiliser
        // false = JWTTimestamp n'a pas été utiliser
    }

    return false; 
}

const User = mongoose.model('User', userSchema)

module.exports = User