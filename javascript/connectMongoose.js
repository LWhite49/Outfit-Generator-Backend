const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoConnector = process.env.DB_CONNECTION_JS;

// Function for connecting to DB using env file

const mongooseConnect = async () => {
    try {
        await mongoose.connect(mongoConnector)
        console.log('Connected to DB');
    }
    catch (err) {
        console.log(err);
        console.log('Failed to connect to DB');}
}

module.exports = mongooseConnect
