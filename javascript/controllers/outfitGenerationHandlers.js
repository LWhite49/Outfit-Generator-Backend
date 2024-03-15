// This file contains all the callback functions pertaining to the generation of outfits from the database

// Import the DB collections
const TopMen = require('../mongo-config/Top-Men.js');
const BottomMen = require('../mongo-config/Bottom-Men.js');
const ShoeMen = require('../mongo-config/Shoe-Men.js');
const TopWomen = require('../mongo-config/Top-Women.js');
const BottomWomen = require('../mongo-config/Bottom-Women.js');
const ShoeWomen = require('../mongo-config/Shoe-Women.js');

// This function accepts a gender for top, bottom, and shoe, and returns 30 random outfits
const generateRandomOutfits = async (req, res) => {

    // Source gender from request body
    const topGender = req.query.topGender;
    const bottomGender = req.query.bottomGender;
    const shoeGender = req.query.shoeGender;
    const targetSize = req.query.size;
    const targetBrand = req.query.brand;

    // Assign collections to target based on passed gender values
    let collections = [];
    collections.push((topGender == "female") ? TopWomen : TopMen);
    collections.push((bottomGender == "female") ? BottomWomen : BottomMen);
    collections.push((shoeGender == "female") ? ShoeWomen : ShoeMen);

    // Define array to hold 30 random outfits
    let returnOutfits = [];
    let randomTops, randomBottoms, randomShoes;
    try {
        // Get 30 random documents from each collection in collections
        randomTops = await collections[0].aggregate([{$sample: {size: 30}}]);
        randomBottoms = await collections[1].aggregate([{$sample: {size: 30}}]);
        randomShoes = await collections[2].aggregate([{$sample: {size: 30}}]);
    } catch (err) {
        console.log(err);
        res.status(401).json({err: `${err}`});
    }

    // Populate returnOutfits via iteration
    for (let i = 0; i < 30; i++) {
        returnOutfits.push({
            top: randomTops[i],
            bottom: randomBottoms[i],
            shoes: randomShoes[i]
        });
    }

    // Send returnOutfits
    res.status(201).json(returnOutfits);
}

// This function accepts a gender for top, bottom, and shoes, as well as a brand and returns 15 random outfits
const generateRandomOutfitsByBrand = async (req, res) => {
    // Source gender from request query, as well as brand
    const topGender = req.query.topGender;
    const bottomGender = req.query.bottomGender;
    const shoeGender = req.query.shoeGender;
    const targetBrand = req.query.brand;
    const targetSize = req.query.size;

    // Assign collections to target based on gender values
    let collections = [];
    collections.push((topGender == "female") ? TopWomen : TopMen);
    collections.push((bottomGender == "female") ? BottomWomen : BottomMen);
    collections.push((shoeGender == "female") ? ShoeWomen : ShoeMen);

    let brandTops, brandBottoms, brandShoes;
    try {
        // Source array of brands from each collection
        brandTops = await collections[0].aggregate([{$match: {productBrand: targetBrand}}, {$sample: {size: 15}}]);
        brandBottoms = await collections[1].aggregate([{$match: {productBrand: targetBrand}}, {$sample: {size: 15}}]);
        brandShoes = await collections[2].aggregate([{$match: {productBrand: targetBrand}}, {$sample: {size: 15}}]);

        // Ensure 15 documents were found for each collection, filling each with random documents if not
        if (brandTops.length < 15) { brandTops = brandTops.concat(await collections[0].aggregate([{$sample: {size: 15 - brandTops.length}}]));}
        if (brandBottoms.length < 15) { brandBottoms = brandBottoms.concat(await collections[1].aggregate([{$sample: {size: 15 - brandBottoms.length}}]));}
        if (brandShoes.length < 15) { brandShoes = brandShoes.concat(await collections[2].aggregate([{$sample: {size: 15 - brandShoes.length}}]));}
    } catch (err) {
        console.log(err);
        res.status(401).json({err: `${err}`});
    }

    // Define array to hold 15 random outfits
    const returnOutfits = [];

    // Populate returnOutfits via iteration
    for (let i = 0; i < 15; i++) {
        returnOutfits.push({
            shirt: brandTops[i],
            pants: brandBottoms[i],
            shoes: brandShoes[i]
        });
    }

    // Send returnOutfits
    res.status(201).json(returnOutfits);
}

// Export route handlers
module.exports = { generateRandomOutfits, generateRandomOutfitsByBrand }