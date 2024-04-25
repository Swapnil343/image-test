require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
console.log(process.env.mongo_key)
mongoose.connect(process.env.mongo_key);
const app = express();

app.use(bodyParser.raw({ type: 'image/*' })); 

const UserSchema = new mongoose.Schema({
    image: String
});

const ImageModel = mongoose.model('Image', UserSchema); 
const imageDirectory="C:/Users/youga/OneDrive/Desktop/Test";

app.get('/data', (req, res) => {
    ImageModel.find({}).then(function(users){
        //res.send(imageName);
        res.send(users);
    }).catch(function(err){
        console.log(err)
    })
});

app.post('/upload', (req, res) => {
    const imageName =Date.now()+".jpeg";
    const imagePath=path.join(imageDirectory,imageName);
    const imageBuffer = req.body;
    fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
            res.send("Error saving image to disk");
        } else {
            const newImage = new ImageModel({ imageName: imageName });
            newImage.save()
                .then(image => {
                    res.send("Image uploaded and saved successfully");
                })
                .catch(err => {
                    console.error(err);
                    res.send("Error saving image to database");
                });
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running at port ", process.env.PORT);
});