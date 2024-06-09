// This file contains all the callback functions pertaining to the generation of outfits from the database

// Import the DB collections
const TopMen = require("../mongo-config/Top-Men.js");
const BottomMen = require("../mongo-config/Bottom-Men.js");
const ShoeMen = require("../mongo-config/Shoe-Men.js");
const TopWomen = require("../mongo-config/Top-Women.js");
const BottomWomen = require("../mongo-config/Bottom-Women.js");
const ShoeWomen = require("../mongo-config/Shoe-Women.js");

// Import the child process so we can run py scripts
const { spawn } = require("child_process");
const path = require("path");
// Define function that accepts two or three color pallet arrays, then sends them into the color processing algorithm, returning a float score

const scoreColorsViaPy = async (p1, p2, p3) => {
	return new Promise((resolve, reject) => {
		pyProcess = spawn("python", [
			path.join(__dirname, "score_combination.py"),
			JSON.stringify(p1),
			JSON.stringify(p2),
			JSON.stringify(p3),
		]);

		// Parse good output
		pyProcess.stdout.on("data", (data) => {
			resolve(JSON.parse(data));
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

	// Specify length of pallets and number of outfits
	const palletSize = 50;
	const outfitCount = 20;

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
	};

	// Define a bool that will be used to determine if the pallets were populated with random items
	let wasRandom = false;
	if (
		palletTops.length < palletSize - 15 ||
		palletBottoms.length < palletSize - 15 ||
		palletShoes.length < palletSize - 15
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

	// Send the color pallets to the PyScript
	try {
		const outfitIndices = await scoreColorsViaPy(
			topColors,
			bottomColors,
			shoeColors
		);
		returnOutfits.outfits = outfitIndices;
	} catch (err) {
		console.log(err, `Error communicating with Py color combinations`);
	}
	// Send returnOutfits
	res.status(201).json(returnOutfits);
	return;

	/* Psuedocode for the creation of outfits
        Note that this process will not create a new returnObject, only add objects of INDICES to the returnOutfits.outfitIndices array

    while (returnOutfits.outfitIndices.length < outfitCount) {

        1. Define an object that will be filled with the indices of the items in the pallets:
            const tempIndexObj = {top: 0, bottom: 0, shoes: 0};

        2. Use the loop iterator % 2 to determine the order of which pallets to pick from:
            follow the cycle top -> bottom -> shoes --> top...

        3.For the first collection, generate a random index between 0 and palletSize - 1 and assign it to the corresponding key in tempIndexObj
            maybe consider a way of ensuring that the same item cannot be selected first more than once to ensure unique pairings?

        4. For the second collection, generate six random indices between 0 and palletSize - 1
            we can play with the number chosen to generate here mostly based on runtime

        5. Compare the colors of the first selected item with each of the six items in the second collection
            keep the two indices that have the best combinaiton with the first selected item

        6. For the third collection, generate six random indices between 0 and palletSize - 1
            we can play with the number chosen to generate here mostly based on runtime

        7. Now working with three way combinations, compare all permutations of [1 x 2 x 6] to find the best combination of colors
           to derive two possible outfits:
                - random item from first collection + first best match from seocnd collection + best three way match from third collection
                - random item from first collection + second best match from second collection + best three way match from third collection
                Assess each of these outfits seprately and if they pass a certain quality threshold, add them to the returnOutfits.outfitIndices array
                as an object in the form:
                    {top: topIndex, bottom: bottomIndex, shoes: shoeIndex}
    }
*/
};

// Export route handlers
module.exports = { generateOutfitFeed };
