// Import Connect Mongoose
const connectMongoose = require('./connectMongoose.js');
// Import the DB collections
const TopMen = require('./mongo-config/Top-Men.js');
const BottomMen = require('./mongo-config/Bottom-Men.js');
const ShoeMen = require('./mongo-config/Shoe-Men.js');
const TopWomen = require('./mongo-config/Top-Women.js');
const BottomWomen = require('./mongo-config/Bottom-Women.js');
const ShoeWomen = require('./mongo-config/Shoe-Women.js');
// Define array of collecitons to iterate
const collections = [TopMen, BottomMen, ShoeMen, TopWomen, BottomWomen, ShoeWomen];
//Connect to Mongoose
connectMongoose();
// Define async clear function
const clearAllCollections = async () => {
    try { 
        for (let collection of collections) { 
            await collection.deleteMany({}); 
        }
        console.log('All collections cleared!');
    } catch (error) { console.error(error); }
}
// Call the clear function
clearAllCollections();