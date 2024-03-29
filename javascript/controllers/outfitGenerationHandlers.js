// This file contains all the callback functions pertaining to the generation of outfits from the database

// Import the DB collections
const TopMen = require('../mongo-config/Top-Men.js');
const BottomMen = require('../mongo-config/Bottom-Men.js');
const ShoeMen = require('../mongo-config/Shoe-Men.js');
const TopWomen = require('../mongo-config/Top-Women.js');
const BottomWomen = require('../mongo-config/Bottom-Women.js');
const ShoeWomen = require('../mongo-config/Shoe-Women.js');

// This function accepts a gender for top, bottom, and shoe, and returns 30 random outfits
const generateOutfitFeed = async (req, res) => {

    // Source gender from request body
    const topGender = req.query.topGender;
    const bottomGender = req.query.bottomGender;
    const shoeGender = req.query.shoeGender;
    const sizeData = JSON.parse(req.query.size);
    const brandData = JSON.parse(req.query.brand);

    // Assign collections to target based on passed gender values
    let collections = [];
    collections.push((topGender == "female") ? TopWomen : TopMen);
    collections.push((bottomGender == "female") ? BottomWomen : BottomMen);
    collections.push((shoeGender == "female") ? ShoeWomen : ShoeMen);

    // Curate list of around 200 random pieces of clothing from each collection, to the specified size and brand

    // We will use these to form the outfits, so call these "pallet" items
    let palletTops, palletBottoms, palletShoes;

    console.log(sizeData.topSizes);

    // Define options for each collection
    let topOptions = [ {$sample: {size: 200}} ];
    let bottomOptions = [ {$sample: {size: 200}} ];
    let shoeOptions = [ {$sample: {size: 200}} ];

    // Conditionally apply match specifications to each collection
    if (sizeData.topSizes.length > 0 || brandData.length > 0) {
        let match = {};
        if (sizeData.topSizes.length > 0) { match.productSize = { $in: sizeData.topSizes }; }
        if (brandData.length > 0) { match.productBrand = { $in: brandData }; }
        topOptions.unshift({$match: match});
    }

    if (sizeData.bottomSizes.length > 0 || brandData.length > 0) {
        let match = {};
        if (sizeData.bottomSizes.length > 0) { match.productSize = { $in: sizeData.bottomSizes }; }
        if (brandData.length > 0) { match.productBrand = { $in: brandData }; }
        bottomOptions.unshift({$match: match});
    }

    if (sizeData.shoeSizes.length > 0 || brandData.length > 0) {
        let match = {};
        if (sizeData.shoeSizes.length > 0) { match.productSize = { $in: sizeData.shoeSizes }; }
        if (brandData.length > 0) { match.productBrand = { $in: brandData }; }
        shoeOptions.unshift({$match: match});
    }

    // Source the pallet items using rendered options
    try {
        // Aggregate Pallets from each collection in collections
        palletTops = await collections[0].aggregate(topOptions);
        palletBottoms = await collections[1].aggregate(bottomOptions);
        palletShoes = await collections[2].aggregate(shoeOptions);
    } catch (err) {
        console.log(err);
        res.status(401).json({err: `${err}`});
    }

    // Define array to hold 30 return outfits
    let returnOutfits = [];

    // Run Algorithm to find the best outfits possible from pallet items


    // Populate returnOutfits with those outfits
    for (let i = 0; i < 30; i++) {
        returnOutfits.push({
            top: palletTops[i],
            bottom: palletBottoms[i],
            shoes: palletShoes[i]
        });
    }

    // Send returnOutfits
    res.status(201).json(returnOutfits);
}


// Export route handlers
module.exports = { generateOutfitFeed }