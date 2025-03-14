const userModel = require('../models/users.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklist.Token.model');
const captainModel = require('../models/captain.model');
const userModel = require('../models/users.models');

module.exports.authUser = async (req , res , next) => {
    const token =req.cookies.token || req.header.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await blacklistTokenModel.findById(decoded._id);

        req.user = user;
       return next();
    } catch (error) {
        res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports.authCaptain = async (req , res , next) => {
    const token =req.cookies.token || req.header.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    } catch (error) {
        res.status(401).json({message: 'Unauthorized'});
    }
}