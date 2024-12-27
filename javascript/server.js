const express = require("express");

const connectToMongoose = require("./connectMongoose.js");
const { clerkMiddleware } = require("@clerk/express");
const cors = require("cors");

// Import the outfit handlers
const {
	generateOutfitFeed,
	rateOutfit,
	deleteItem,
	getFlaggedItems,
	assessFlaggedItem,
} = require("./controllers/outfitGenerationHandlers.js");

// Import the user handlers
const {
	initializeUser,
	deleteUser,
	saveOutfit,
} = require("./controllers/clerkUserHandlers.js");

// Connect to MongoDB
connectToMongoose();

// Create App
const app = express();

// Middleware
app.use(express.json());

app.use(clerkMiddleware());

// Conditionally assign CORS based on passed argument
const args = process.argv.slice(2);

// If Mobile Server, accept all connections
if (args.includes("mobile")) {
	console.log("Mobile Server: Accepting all connections");
	app.use(
		cors({
			origin: "*",
			methods: ["GET", "POST", "DELETE"],
		})
	);
	// Else, establish CORS
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

// Routes for working with outfits
app.get("/generateOutfitFeed", generateOutfitFeed);
app.post("/rateOutfit", rateOutfit);
app.post("/deleteItem", deleteItem);
app.get("/getFlaggedItems", getFlaggedItems);
app.post("/assessFlaggedItem", assessFlaggedItem);

// Routes for working with users
app.post("/initializeUser", initializeUser);
app.post("/saveOutfit", saveOutfit);
app.post("/deleteUser", deleteUser);

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
