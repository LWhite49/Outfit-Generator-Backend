// This file contains all the callback functions pertaining to the generation of outfits from the database

// Import the DB collections
const TopMen = require("../mongo-config/Top-Men.js");
const BottomMen = require("../mongo-config/Bottom-Men.js");
const ShoeMen = require("../mongo-config/Shoe-Men.js");
const TopWomen = require("../mongo-config/Top-Women.js");
const BottomWomen = require("../mongo-config/Bottom-Women.js");
const ShoeWomen = require("../mongo-config/Shoe-Women.js");
const ReportedItems = require("../mongo-config/Reported-Items.js");

// Import the child process so we can run py scripts
const { spawn } = require("child_process");
const path = require("path");

// Define function that accepts two or three color pallet arrays, then sends them into the color processing algorithm, returning a float score

const scoreColorsViaPy = async (p1, p2, p3, g1, g2, g3, n) => {
	return new Promise((resolve, reject) => {
		// Structure Data Object
		const dataToPass = {
			p1: p1,
			p2: p2,
			p3: p3,
			g1: g1,
			g2: g2,
			g3: g3,
			n: n
		}

		console.log("Spawning PyScript: ");
		const pyProcess = spawn("python", [
			path.join(__dirname, "score_combination.py"),	
		]);

		// Send Data through stdin
		pyProcess.stdin.write(JSON.stringify(dataToPass));
		pyProcess.stdin.end();

		// Parse good output
		pyProcess.stdout.on("data", (data) => {
			resolve(JSON.parse(data));
		});

		// Parse error output
		pyProcess.stderr.on("data", (data) => {
			console.log(data.toString());
			reject(JSON.parse(data));
		});
	});
};

// Define function that accepts three color pallet arrays and a bool score, updating the ML model with Python
const updateModelViaPy = async (p1, p2, p3, id1, id2, id3, score) => {
	return new Promise((resolve, reject) => {
		const pyProcess = spawn("python", [
			path.join(__dirname, "update_model.py"),
			JSON.stringify(p1),
			JSON.stringify(p2),
			JSON.stringify(p3),
			JSON.stringify(id1),
			JSON.stringify(id2),
			JSON.stringify(id3),
			JSON.stringify(score),
		]);

		// Parse good output
		pyProcess.stdout.on("data", (data) => {
			resolve(data.toString());
		});

		// Parse error output
		pyProcess.stderr.on("data", (data) => {
			console.log(data.toString());
			reject(data.toString());
		});
	});
};

// This function accepts a variety of query information and returns a feed of outfits informed by color processing algorithm
const generateOutfitFeed = async (req, res) => {
	// Source gender from request body
	const topGender = req.query.topGender;
	const bottomGender = req.query.bottomGender;
	const shoeGender = req.query.shoeGender;
	const sizeData = JSON.parse(req.query.size);
	const brandData = JSON.parse(req.query.brand);

	console.log("Received");
	// Specify length of pallets and number of outfits
	const palletSize = JSON.parse(req.query.palletSize);
	const outfitCount = JSON.parse(req.query.outfitCount);

	// Parse gender queries to determine which collections to use
	let collections = [];
	collections.push(topGender == "female" ? TopWomen : TopMen);
	collections.push(bottomGender == "female" ? BottomWomen : BottomMen);
	collections.push(shoeGender == "female" ? ShoeWomen : ShoeMen);

	// We will use these items to form the outfits, so call these "pallet" items
	let palletTops = [];
	let palletBottoms = [];
	let palletShoes = [];

	// Define options object for each collection, which will be informed by the queries
	let topOptions = [{ $sample: { size: palletSize } }];
	let bottomOptions = [{ $sample: { size: palletSize } }];
	let shoeOptions = [{ $sample: { size: palletSize } }];

	// Conditionally apply match specifications to each collection
	if (true) {
		let match = { $expr: { $gt: [{ $size: "$productColors" }, 0] } };
		if (sizeData.topSizes.length > 0) {
			match.productSize = { $in: sizeData.topSizes };
		}
		if (brandData.length > 0) {
			match.productBrand = { $in: brandData };
		}
		topOptions.unshift({ $match: match });
	}

	if (true) {
		let match = { $expr: { $gt: [{ $size: "$productColors" }, 0] } };
		if (sizeData.bottomSizes.length > 0) {
			match.productSize = { $in: sizeData.bottomSizes };
		}
		if (brandData.length > 0) {
			match.productBrand = { $in: brandData };
		}
		bottomOptions.unshift({ $match: match });
	}

	if (true) {
		let match = { $expr: { $gt: [{ $size: "$productColors" }, 0] } };
		if (sizeData.shoeSizes.length > 0) {
			match.productSize = { $in: sizeData.shoeSizes };
		}
		if (brandData.length > 0) {
			match.productBrand = { $in: brandData };
		}
		shoeOptions.unshift({ $match: match });
	}

	console.log("Aggregating Pallets");
	// Source the pallet items using rendered options
	try {
		// Aggregate Pallets from each collection in collections
		palletTops = await collections[0].aggregate(topOptions);
		palletBottoms = await collections[1].aggregate(bottomOptions);
		palletShoes = await collections[2].aggregate(shoeOptions);
	} catch (err) {
		console.log(err, `Error in generating pallets from initial query`);
		res.status(401).json({ err: `${err}` });
		return;
	}

	// Define returnOutfits object to be populated with the pallet, the wasRandom flag, and the outfitIndices
	let returnOutfits = {
		pallet: [],
		outfits: [],
		wasRandom: false,
	};

	// Define a bool that will be used to determine if the pallets were populated with random items
	let wasRandom = false;
	if (
		palletTops.length < palletSize - 9 ||
		palletBottoms.length < palletSize - 9 ||
		palletShoes.length < palletSize - 9
	) {
		wasRandom = true;
	}

	returnOutfits.wasRandom = wasRandom;

	// Populate any pallets with less than palletSize items with random items from the collection, trying sizes and then completely random
	try {
		if (palletTops.length < palletSize) {
			palletTops = palletTops.concat(
				await collections[0].aggregate([
					{ $sample: { size: palletSize - palletTops.length } },
					{
						$match: {
							productSize: { $in: sizeData.bottomSizes },
							$expr: { $gt: [{ $size: "$productColors" }, 0] },
						},
					},
				])
			);
			palletTops = palletTops.concat(
				await collections[0].aggregate([
					{ $sample: { size: palletSize - palletTops.length } },
				])
			);
		}

		if (palletBottoms.length < palletSize) {
			palletBottoms = palletBottoms.concat(
				await collections[1].aggregate([
					{ $sample: { size: palletSize - palletBottoms.length } },
					{
						$match: {
							productSize: { $in: sizeData.bottomSizes },
							$expr: { $gt: [{ $size: "$productColors" }, 0] },
						},
					},
				])
			);
			palletBottoms = palletBottoms.concat(
				await collections[1].aggregate([
					{ $sample: { size: palletSize - palletBottoms.length } },
				])
			);
		}

		if (palletShoes.length < palletSize) {
			palletShoes = palletShoes.concat(
				await collections[2].aggregate([
					{ $sample: { size: palletSize - palletShoes.length } },
					{
						$match: {
							productSize: { $in: sizeData.bottomSizes },
							$expr: { $gt: [{ $size: "$productColors" }, 0] },
						},
					},
				])
			);
			palletShoes = palletShoes.concat(
				await collections[2].aggregate([
					{ $sample: { size: palletSize - palletShoes.length } },
				])
			);
		}
	} catch (err) {
		console.log(err, `Error in populating pallets with random items`);
		res.status(401).json({ err: `${err}` });
		return;
	}

	// Populate returnOutfits.pallet with the pallet items
	for (let i = 0; i < palletSize; i++) {
		returnOutfits.pallet.push({
			top: palletTops[i],
			bottom: palletBottoms[i],
			shoes: palletShoes[i],
		});
	}

	// Create arrays of productColor arrays
	let topColors = palletTops.map((item) => item.productColors);
	let bottomColors = palletBottoms.map((item) => item.productColors);
	let shoeColors = palletShoes.map((item) => item.productColors);
	console.log("Sending colors to PyScript");
	// Send the color pallets to the PyScript
	try {
		const outfitIndices = await scoreColorsViaPy(
			topColors,
			bottomColors,
			shoeColors,
			topGender,
			bottomGender,
			shoeGender,
			outfitCount
		);
		console.log("Received outfitIndices from PyScript:", outfitIndices);
		returnOutfits.outfits = outfitIndices;
	} catch (err) {
		console.log(err, `Error communicating with Py color combinations`);
	}
	// Send returnOutfits
	res.status(201).json(returnOutfits);
	return;
};

// This function handles a post request to rate an outfit, updating the ML Model
const rateOutfit = async (req, res) => {
	// Parse the request body
	const p1 = req.body.p1;
	const p2 = req.body.p2;
	const p3 = req.body.p3;
	const id1 = req.body.id1;
	const id2 = req.body.id2;
	const id3 = req.body.id3;
	const rating = req.body.rating;

	// Send the colors to the PyScript
	try {
		console.log("Sending Rating to PyScript...");
		console.log(p1, p2, p3, id1, id2, id3, rating);
		const response = await updateModelViaPy(
			p1,
			p2,
			p3,
			id1,
			id2,
			id3,
			rating
		);
		console.log("Updated ML Model Successfully:", response);
		res.status(201).json({ message: "Outfit rated" });
	} catch (err) {
		console.log(err, `Error communicating with Py to update ML Model`);
		res.status(401).json({ err: `${err}` });
	}

	// Send response

	return;
};

// This function handles a post request to delete an outfit
const deleteItem = async (req, res) => {
	// Source id and collection from request body
	const id = req.body.id;
	const collection = req.body.collection;
	const item = req.body.item;
	let collectionName;
	console.log(`Deleting item ${id} from collection ${collection}`);
	switch (collection) {
		case 0:
			collectionName = TopMen;
			break;
		case 1:
			collectionName = BottomMen;
			break;
		case 2:
			collectionName = ShoeMen;
			break;
		case 3:
			collectionName = TopWomen;
			break;
		case 4:
			collectionName = BottomWomen;
			break;
		case 5:
			collectionName = ShoeWomen;
			break;
	}

	// Delete the item from the collection
	try {
		away = await collectionName.deleteOne({ productImg: id });
		console.log("Deleted item from collection");
	} catch (err) {
		console.log(err, `Error deleting item from collection`);
	}
	// Add copy of item to reported items collection
	try {
		await ReportedItems.create({
			productListing: item.productListing,
			productImg: item.productImg,
			productBrand: item.productBrand,
			productSize: item.productSize,
			createdAt: item.createdAt,
			collectionType: collection,
		});
		// Update color
		await ReportedItems.updateOne(
			{ productImg: item.productImg },
			{ $set: { productColors: item.productColors } }
		);
		console.log("Added item to reported items collection");
		res.status(201).json({ message: "Item deleted" });
	} catch (err) {
		console.log(err, `Error adding item to reported items collection`);
		res.status(401).json({ err: `${err}` });
		return;
	}
};

// Method for accessing flagged items
const getFlaggedItems = async (req, res) => {
	// return all flagged items
	try {
		const flaggedItems = await ReportedItems.find({});
		res.status(201).json(flaggedItems);
	} catch (err) {
		console.log(err, `Error retrieving flagged items`);
		res.status(401).json({ err: `${err}` });
		return;
	}
};

// Method for assessing flagged item
const assessFlaggedItem = async (req, res) => {
	// Source id and collection from request body
	const id = req.body.id;
	const collection = req.body.collection;
	const item = req.body.item;
	const decision = req.body.decision;

	if (decision == 0) {
		// Delete the item from the collection
		try {
			await ReportedItems.deleteOne({ productImg: id });
			console.log("Deleted item from collection");
			res.status(201).json({ message: "Item deleted" });
			return;
		} catch (err) {
			console.log(err, `Error deleting item from collection`);
			res.status(401).json({ err: `${err}` });
			return;
		}
	}

	let collectionName;
	switch (collection) {
		case "0":
			collectionName = TopMen;
			break;
		case "1":
			collectionName = BottomMen;
			break;
		case "2":
			collectionName = ShoeMen;
			break;
		case "3":
			collectionName = TopWomen;
			break;
		case "4":
			collectionName = BottomWomen;
			break;
		case "5":
			collectionName = ShoeWomen;
			break;
	}

	// Restore item to collection
	try {
		await collectionName.create({
			productListing: item.productListing,
			productImg: item.productImg,
			productBrand: item.productBrand,
			productSize: item.productSize,
			productColors: item.productColors,
			createdAt: item.createdAt,
		});

		// Delete the item from the reported items collection
		await ReportedItems.deleteOne({ productImg: id });
		console.log("Restored item to collection");
		res.status(201).json({ message: "Item restored" });
	} catch (err) {
		console.log(err, `Error restoring item to collection`);
		res.status(401).json({ err: `${err}` });
		return;
	}
};
// Export route handlers
module.exports = {
	generateOutfitFeed,
	rateOutfit,
	deleteItem,
	getFlaggedItems,
	assessFlaggedItem,
};
