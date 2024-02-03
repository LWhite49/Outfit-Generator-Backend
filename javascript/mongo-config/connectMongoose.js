const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongoConnector = process.env.DB_CONNECTION_JS;
console.log(mongoConnector);

// Function for connecting to DB using env file

const mongooseConnect = async () => {
    try {
        await mongoose.connect(mongoConnector)
    }
    catch (err) {console.log(err);}
}

module.exports = mongooseConnect
