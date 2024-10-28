const mongoose = require("mongoose");
const { collection } = require("./Bottom-Men");
const Schema = mongoose.Schema;

const reportedItemsSchema = new Schema({
	productListing: {
		type: String,
		required: true,
	},
	productImg: {
		type: String,
		required: true,
	},
	productBrand: {
		type: String,
		required: true,
		index: true,
	},
	productSize: {
		type: String,
		index: true,
	},
	productColors: {
		type: Schema.Types.Mixed, //Replace String with color object specifications, proabably as a subschema
		index: true,
	},
	createdAt: {
		type: Date,
		required: true,
	},
	collectionType: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("ReportedItems", reportedItemsSchema);
