const mongoose = require('mongoose');
// Grab Schema class from mongoose
const Schema = mongoose.Schema;
// Create Schema for Men's Top collection
const topMenSchema = new Schema({
    productListing: {
        type: String,
        required: true
    },
    productImg: {
        type: String,
        required: true
    },
    productSummary: {
        type: String,
        required: true,
        index: true
    },
    productKeywords: {
        type: [{type: String, index: true}],
        index: true
    },
    productSize: {
        type: String,
        index: true
    }
});

// Export the schema
module.exports = mongoose.model("TopMen", topMenSchema);