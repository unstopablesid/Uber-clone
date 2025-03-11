const userModel = require('../models/users.models');
const userServices = require('../Services/user.services');
const {validationResult} = require('express-validator');

module.exports.registerUser = async (req, res,next) => {
    const errors = validationResult(req);

    if(!errors.isempty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, email, password} = req.body;

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





