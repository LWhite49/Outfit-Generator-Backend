const express = require("express");
const mongoose = require("mongoose");
const connectToMongoose = require("./connectMongoose.js");
const cors = require("cors");

// Import the route handlers
const {
	generateOutfitFeed,
	rateOutfit,
	deleteItem,
	getFlaggedItems,
	assessFlaggedItem,
} = require("./controllers/outfitGenerationHandlers.js");

// Connect to MongoDB
connectToMongoose();

// Create App
const app = express();

// Middleware
app.use(express.json());

// Conditionally assign CORS based on passed argument
const args = process.argv.slice(2);

// If Dev Server, accept all connections
if (args.includes("dev")) {
	console.log("Dev Server: Accepting all connections");
	app.use(
		cors({
			origin: "*",
			methods: ["GET", "POST", "DELETE"],
			credentials: true,
		})
	);
} else {
	app.use(
		cors({
			origin: function (origin, callback) {
				if (!origin) return callback(null, true);
				if (origin.includes("wardrobewizard.app")) {
					return callback(null, true);
				}
				return callback(new Error("Not allowed by CORS"));
			},
			methods: ["GET", "POST", "DELETE"],
			credentials: true,
		})
	);
	console.log("Prod Server");
}
// Specify Routes
app.get("/generateOutfitFeed", generateOutfitFeed);
app.post("/rateOutfit", rateOutfit);
app.post("/deleteItem", deleteItem);
app.get("/getFlaggedItems", getFlaggedItems);
app.post("/assessFlaggedItem", assessFlaggedItem);

// Launch Server
const PORT = 10000;
app.listen(PORT, () => {
	console.log(
		"Server is running on port " +
			PORT +
			" at " +
			new Date().toLocaleTimeString()
	);
});
