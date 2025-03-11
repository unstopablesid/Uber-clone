const express = require('express');
const router = express.Router();
const {body} = require('express-validator');


router.post('/register',[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('firstName').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('lastName').isLength({min: 3}).withMessage('Last name must be at least 3 characters long'),
    
])


module.exports = router;
