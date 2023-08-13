// Connecting to the MongoDb
const mongoose = require("mongoose");
const mongoose_url = "mongodb://localhost:27017/iNotebook";

let connected_message = () => {
  console.log("Connected to the MongoDb");
};
const connect_mongo = () => {
  mongoose.connect(mongoose_url, connected_message());
};
module.exports = connect_mongo;
