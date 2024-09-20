const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const validator = require('validator')

const User = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    is_deleted: {
        type: Boolean
    }
}, { timestamps: true })

// sign up
User.statics.addUser = async function(email, password, username, phone, role, is_deleted) {
    //validation
    if(!email || !password){
        throw Error('No empty field!')
    }
    
    if(!validator.isEmail(email)){
        throw Error('Invalid email!')
    }

    // if(!validator.isStrongPassword(password)){
    //     throw Error('Password not strong enough!')
    // }

    // if(!validator.isMobilePhone(phone, 'vi-VN')){
    //     throw Error('Invalid phone number!')
    // }

    const exists = await this.findOne({email})

    if(exists){
        throw Error('Email already in use!')
    }
    //hassing password
    const salt = await bcrypt.genSalt(10)
    const hass = await bcrypt.hash(password, salt)

    const user = await this.create({email, password: hass, username, phone, role, is_deleted})

    return user
}
// login method
User.statics.login = async function(email, password){
    //validation
    if(!email || !password){
        throw Error('No empty field!')
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('No user found')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Invalid login')
    }

    return user
}

module.exports = mongoose.model('User', User)