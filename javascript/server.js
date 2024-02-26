const express = require('express');
const mongoose = require('mongoose');
const connectToMongoose = require('./connectMongoose.js');


// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');
const TopWomen = require('./mongo-config/Top-Women.js');
const BottomWomen = require('./mongo-config/Bottom-Women.js');
const ShoeWomen = require('./mongo-config/Shoe-Women.js');

// Connect to MongoDB
connectToMongoose();

// Specify Routes for the App


// Create App
const app = express();

// Launch Server
const PORT = 3500;
app.listen(PORT, () => {console.log("Server is running on port " + PORT + " at " + new Date().toLocaleTimeString())});

