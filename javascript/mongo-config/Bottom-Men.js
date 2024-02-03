const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bottomMenSchema = new Schema({
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

module.exports = mongoose.model("BottomMen", bottomMenSchema);