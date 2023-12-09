const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const db_name = "easitoryDB";

// configure database///////////
//handles connection to database, and accept a callback
async function connectDB(cb) {
  let database_client;
  MongoClient.connect(url)
    .then((client) => {
      database_client = client.db(db_name);
      console.log("db is connected");
      return cb(database_client);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { connectDB };
