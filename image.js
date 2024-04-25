require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env.mongo_key, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();

app.use(bodyParser.raw({ type: 'image/*' }));

const UserSchema = new mongoose.Schema({
    image: Buffer // Storing image data as a Buffer
});

const ImageModel = mongoose.model('Image', UserSchema);

app.get('/data', (req, res) => {
    ImageModel.find({}).then(function(images) {
        res.send(images);
    }).catch(function(err) {
        console.log(err);
        res.status(500).send("Error retrieving images from database");
    });
});

app.post('/upload', (req, res) => {
    const imageBuffer = req.body;
    const newImage = new ImageModel({ image: imageBuffer });

    newImage.save()
        .then(image => {
            res.send("Image uploaded and saved successfully");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error saving image to database");
        });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log("Server is running at port ", PORT);
});
