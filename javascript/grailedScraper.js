const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectMongoose = require('./mongo-config/connectMongoose');

// Connect to DB
connectMongoose();

// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');


// Create a sample document
const v = new TopMen({
    productListing: "https://www.grailed.com/listings/55543068-hawaiian-shirt-x-streetwear-x-vintage-vintage-silk-hawaiian-shirt-pigment-dyed-geometric-floral-m?g_aidx=Listing_production&g_aqid=6edeb74d49354f7e74d6177d361e93a5",
    productImg: "https://media-assets.grailed.com/prd/listing/temp/b3e84482afcc46db9bc005b519475fa2?w=1600&h=1600&fit=clip&q=40&auto=format",
    productSummary: "Vintage Silk Hawaiian Shirt Pigment Dyed Geometric Floral M",
    productKeywords: ["vintage", "silk", "hawaiian", "shirt", "floral", "geometric"],
    productSize: "M"
});

// Add sample document to DB if not already there
const sampleDupe = TopMen.findOne({productSummary: v.productListing});
if (!sampleDupe) { TopMen.create(v);}
else {console.log("Sample already in DB");}