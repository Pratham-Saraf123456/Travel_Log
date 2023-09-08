

const fs = require('fs');

const {v4 : uuid} = require('uuid');
const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

exports.getPlaceById = async (req,res,next) => {
    const placeId = req.params.pId; //all the dynamic part of the url can be accessed by the params object as this dynamic content are stored in form of object {pId:....,....}
    let place;

    try{
        place = await Place.findById(placeId);

    }catch(err){
        const error = new HttpError('Something went wrong,place might be not present',500);

        return next(error);
    }

    if(!place){
        return next(new HttpError('Could not find the place page you searched!!',404));
    }

    res.json({ place : place.toObject({getters:true}) }); // if the key and value name is same then we can write the only one name json will understand automatically that the key and value name is same for e.g. :: {place} === {place:place}
   
}

exports.getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uId;

    //alternative approach to get place for respective user
    let userWithPlaces;
    try{
        userWithPlaces = await User.findById(userId).populate('places');
    }catch(err){
        const error = new HttpError('Something went wrong,places are not founc !! ',500);

        return next(error);
    }

    if(!userWithPlaces ){
        return next(new HttpError('Could not find the place page relate the particular user!!',404));
    }

    res.json({ userPlace: userWithPlaces.places.map(place => place.toObject({getters:true})) });
}


exports.postCreatePlace = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        //as the function is asyncronous we cannot use throw it will not work correctly
        return next(new HttpError('Invalid input credential!!',422));
    }

    //after replacing the coordinates with the api for address
    // const { title , description  , address , creator} = req.body;
    const { title , description  , address} = req.body;


    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    }
    catch(error){
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        address,
        location:coordinates,
        image:req.file.path,
        creator:req.userData.userId
    });
    // image:"https://media.istockphoto.com/id/486334510/photo/new-york-city-skyline.jpg?b=1&s=170667a&w=0&k=20&c=giW5LHT4SQGNpH4QuMPjDIi7mOlvW09DrpJXTY9D_ic=",
        

    let user;
    try{
        user = await User.findById(req.userData.userId);
    }catch(err) {
        const error = new HttpError('Failed in creating places!!',500);

        return next(error);
    } 

    if(!user){
        const error = new HttpError('Falied in storing places !!! ',500);

        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();        
        await createdPlace.save({session : sess});
        user.places.push(createdPlace);
        await user.save({session : sess});
        await sess.commitTransaction();
        
        
    } catch (error) {
        const err = new HttpError('Saving the place data failed!!',500);

        return next(err);
    }

    res.status(201).json({place : createdPlace});
}

exports.patchUpdatePlace = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new HttpError('Invalid Input Credential!!',422);
    }

    const placeId = req.params.pId;
    const {title,description} = req.body;

    let updatePlace;
    try{
        updatePlace = await Place.findById(placeId);
    }
    catch(err){
        const error = new HttpError('Something went wrong,cannot update place!!',500);
        
        return next(error);
    }

    if(req.userData.userId !== updatePlace.creator.toString()){
        const error = new HttpError('You are not allowed to change the data',401);
        
        return next(error);
    }

    updatePlace.description = description;
    updatePlace.title = title;

    try{
        await updatePlace.save();
    }
    catch(err){
        const error = new HttpError('Something went wrong , cannot update place!!',500);
    }

    res.status(200).json({place:updatePlace.toObject({getters:true})});


}

exports.deletePlace = async (req,res,next) => {
    const pId = req.params.pId;

    let place;
    try{
        place = await Place.findById(pId).populate('creator');
        // place = await Place.findByIdAndRemove(pId);
    }catch(err){
        const error = new HttpError('Something went wrong , deletion of place failed ',500);
        return next(error);
    }

    if(!place){
        const error = new HttpError('Something went wrong , deletion of place failed ',500);
        return next(error);
    }

    if(req.userData.userId !== place.creator._id.toString()){
        const error = new HttpError('You are not allowed to delete ',401);
        return next(error);
    }

    const imageUrl = place.image;

    try{
        // await place.remove();
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({_id:pId},{session:sess});
        place.creator.places.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();
        
        
    }catch(err){
        const error = new HttpError('qSomething went wrong , deletion of place failed ',500);
        return next(error);
    }

    if(imageUrl){
        fs.unlink(imageUrl, err => {
            console.log(err);
        })

    }

    res.status(200).json({message:"deleted successfully"});

}




