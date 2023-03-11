/*
    controller conating the logic for all the user
    now we are going to encrypt the password before storing it to the database
    to encrypt we will use the package named "bcryptjs" 

    the becrypt.hash take two argument first the password and the second is 
    the salt value and resemble the strength of hash value
    
    >>> 
    now after encrypting the password one another task is to
    generate the token for the particular user
    using the "jsonwebtoken" package
    
    jwt take 3 argument first one may be a string/object/boolean 
    second argument is the secret key which is very important and must not be shared to 
    anyone
    third is simple object notation
*/

const {v4 : uuid} = require('uuid');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUser = async (req,res,next) => {
    let users;

    try{
        users = await User.find({},'-password');
    }catch(err){
        const error = new HttpError('Something went wrong,not find the users!!',500);

        return next(error);
    }

    res.status(200).json({allUser :  users.map(user => user.toObject({getters:true}))});

}

exports.postSignUp = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next( new HttpError('Invalid Input Credential !!!',422));
    }

    const {name,email,password} = req.body;

    let existUser;
    try{
        existUser = await User.findOne({email:email});
    }catch(err){
        const error = new HttpError('Something went wrong , not founc the user!!',500);

        return next(error);
    }

    if(existUser){
        return next( new HttpError('Could not create account ,Email already exists',422));
    }

    let hashPassword;
    try{
        hashPassword = await bcrypt.hash(password,12);
    }catch(err){
        const error =  new Error('Could not make the user account!!',500);

        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image:req.file.path,
        password:hashPassword,
        places:[]
    });

    try{
        await createdUser.save();
        console.log(createdUser);
    }
    catch(err){
        console.log(err);
        const error = new HttpError('Signing up the user failed!!',500);

        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            {userId:createdUser._id,email:createdUser.email},
            'supersecre_dont_share_to_any_one',
            {expiresIn:'1h'}
            )
    }catch(err){
        const error = new HttpError('Signing up the user failed!!',500);

        return next(error);
    }

    res.status(201).json({userId:createdUser._id,email:createdUser.email,token:token});

    // res.status(201).json({user : createdUser.toObject({getters :true})});
}

exports.postLogin = async  (req,res,next) => {
    const {email,password} = req.body;

    let existUser;
    try{
        existUser = await User.findOne({email:email});
    }catch(err){
        const error = new HttpError('Something went wrong , not found the user!!',500);

        return next(error);
    }

    if(!existUser){
        return next( new HttpError('Could not find the user , Wrong Credential Entered!',401));
    }

    let isValidPassword=false;
    try{
        isValidPassword = await bcrypt.compare(password,existUser.password);
    }catch(err){
        const error = new Error("Could not log you in check your credential",500);

        return next(error);
    }

    if(!isValidPassword){
        return next( new HttpError('Could not find the user , Wrong Credential Entered!',401));
    }

    //generating the token 
    let token;
    try{
        token = jwt.sign(
            {userId:existUser._id,email:existUser.email},
            'supersecre_dont_share_to_any_one',
            {expiresIn:'1h'}
            )
    }catch(err){
        const error = new HttpError('Logining in the user failed!!',500);

        return next(error);
    }

    res.json({
        userId:existUser._id,
        email:existUser.email,
        token:token
    })
    // res.json({message :'User Logged in successfully',user:existUser.toObject({getters:true})});
}

