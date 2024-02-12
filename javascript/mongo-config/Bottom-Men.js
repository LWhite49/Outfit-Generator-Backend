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
    productBrand: {
        type: String,
        required: true,
        index: true
    },
    productSize: {
        type: String,
        index: true
    }
});

module.exports = mongoose.model("BottomMen", bottomMenSchema);