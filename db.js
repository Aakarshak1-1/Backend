// Connecting to the MongoDb
const mongoose = require("mongoose");
// const mongoose_url = "mongodb://localhost:27017/iNotebook";
const mongoose_url =
  "mongodb+srv://shotriaakarshak:Ekta%4012%2F05%2F1975@cluster0.si97nbd.mongodb.net/";
let connected_message = () => {
  console.log("Connected to the MongoDb");
};
const connect_mongo = () => {
  mongoose.connect(mongoose_url, connected_message());
};
module.exports = connect_mongo;
