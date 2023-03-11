/*
    we donot store the file and url in the database as it require a lot of memory
    and also the wastage of memory
    and also make the response of the database slower

    after creating the Schema we need to model this Schema and modeling take two
    arguments the first argument is the name of the model and second is the 
    name of the created schema
    
    now creating relation between two schema
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema ({
    title:{
        type :String,
        required : true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    location:{
        lat:{type:Number,required:true},
        lng:{type:Number,required:true}
    },
    creator:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    }

});


module.exports = mongoose.model('Place',placeSchema);