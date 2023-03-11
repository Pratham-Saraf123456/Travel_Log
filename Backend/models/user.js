/*
    mongoose unique validator is the package that is responsible for the unique value in 
    the collections 
*/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String , required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true, minlength:6},
    image:{type:String, required:true},
    places:[{type:mongoose.Types.ObjectId, required:true, ref:'Place'}]
});

// validate the schema and not allow to add the duplicate entry
// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);