const mongoose = require("mongoose");

const URI = "mongodb://0.0.0.0:27017/nodeProject";

const connectDb = async ()=>{
    try {
        await mongoose.connect(URI);
        console.log("DB Connection Successfull");
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
}

module.exports = connectDb;