const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectMongoose = require('./mongo-config/connectMongoose');

// Connect to DB
connectMongoose();

// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');


// Create a sample document
const v = new ShoeMen({
    productListing: "https://www.grailed.com/listings/56215058-balenciaga-balenciaga-paris-low-top-sneaker-in-black?g_aidx=Listing_production&g_aqid=b51a68bed5eb196475210f337747b4a4",
    productImg: "https://media-assets.grailed.com/prd/listing/temp/23df9c0c3b7642e294753b10871eb436?h=700&fit=clip&q=40&auto=format",
    productSummary: "Balenciaga Paris low top sneaker in black",
    productKeywords: ["Balenciaga", "Low Top", "Sneaker"],
    productSize: "10"
});

// Add sample document to DB if not already there
ShoeMen.create(v);