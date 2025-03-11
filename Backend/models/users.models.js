const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstName: {
            type: String,
            required: true,
            min: 6,
            max: 255
        },
        lastName: {
            type: String,
            min: 6,
            max: 255
        },
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        select: false,
    
    },
    soketID:{
        type: String,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;





