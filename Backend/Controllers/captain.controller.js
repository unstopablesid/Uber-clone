const captainService = require('../Services/captain.service');
const blacklistTokenModel = require('../models/blacklist.Token.model');
const {validationResult} = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {fullname, email, password, color, plate, capacity, vehicleType} = req.body;
    const isCaptainExist = await captainService.isCaptainExist(email);
    if(isCaptainExist) {
        return res.status(400).json({message: 'Captain already exists'});
    }
   
    const hashedPassword = await captainService.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname:fullname.firstname, 
        lastname:fullname.lastname, 
        email, 
        password: hashedPassword, 
        color:vehicle.color, 
        plate:vehicle.plate, 
        capacity:vehicle.capacity, 
        vehicleType:vehicle,
    });
    const token = captain.generateAuthToken();
    res.status(201).json({captain, token});
}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    const captain = await captainModel.findOne({email}).select('+password');
    if(!captain) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const isMatch = await captain.comparePassword(password);
    if(!isMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({token,captain})
}
module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({captain: req.captain});
}
module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization').split(' ')[1];
    await blacklistTokenModel.create({token});
    res.clearCookie('token');
    res.status(200).json({message: 'Captain logged out successfully'});
}

