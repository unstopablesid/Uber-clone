const userModel = require('../models/users.models');
const userServices = require('../Services/user.services');
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklist.Token.model');

module.exports.registerUser = async (req, res,next) => {
    const errors = validationResult(req);

    if(!errors.isempty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, email, password} = req.body;
    const isUserExist = await userServices.isUserExist(email);
    if(isUserExist) {
        return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userServices.createUser({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({
        message: 'User created successfully',
        user,
        token
    });
    
    
}
module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isempty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');
    if(!user) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({
        message: 'User logged in successfully',
    })
}

module.exports.getUserProfile = async (req, res, next) => {
    req.status(200).json({
        message: 'User profile fetched successfully',
        user: req.user
    })
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.header('Authorization').split(' ')[1];
    res.status(200).json({message: 'User logged out successfully'});
}
