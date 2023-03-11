/*
    Register the middleware that are responsible to handle the routing 
    related to the user routes
    
*/

const express = require('express');
const {check} = require('express-validator');

const fileUpload = require('../middleware/file-upload');
const userController = require('../controllers/user-controllers');

const router = express.Router();

router.get('/',userController.getUser);

router.post('/signup',
                    fileUpload.single('image'),
                    [
                        check('name').isLength({min:3}),
                        check('email').normalizeEmail().isEmail(),
                        check('password').isLength({min:6})
                    ]
                    ,userController.postSignUp);

router.post('/login',userController.postLogin);


module.exports = router;