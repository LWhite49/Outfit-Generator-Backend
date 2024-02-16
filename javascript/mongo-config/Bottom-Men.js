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
    },
    productColors: {
        type: [ String ], //Replace String with color object specifications, proabably as a subschema
        index: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("BottomMen", bottomMenSchema);