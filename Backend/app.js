

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placeRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

const url =`mongodb+srv://Nishank:2e6qinegEshobrmn@cluster0.sio3l.mongodb.net/mern?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images',express.static(path.join('uploads','images')));

//attaching certain header to the response to avoid error
app.use((req,res,next) => {
    //it allow us to set the domain that can send the request * means we are allowing request fromt all domains
    res.setHeader('Access-Control-Allow-Origin','*');

    //set the header 
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept , Authorization')

    //which http method are required
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');

    next();
})

app.use('/api/places', placeRoutes);//this will only allow the url starting with /api/places to be accepted
app.use('/api/users',userRoutes);

//this will be executed if no routes above matches with the url
app.use((req,res,next) => {
    const error = new HttpError('Could not find the route page',404);

    throw error;
})

//error handling middleware
app.use((error,req,res,next) => {

    if(req.file){
        fs.unlink(req.file.path,err => {
            console.log(err);
        });
    }

    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message : error.message || 'An Unkonwn error occured'});

})


mongoose.connect(url)
        .then(() => {
            console.log("Connection Established!!! ");
            app.listen(5000);
        })
        .catch(err => {
            console.log(err);
        })
