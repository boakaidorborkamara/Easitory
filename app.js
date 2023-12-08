const express = require("express");
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
let db_name = "easitoryDB";

// init app and middleware
const app = express();

// configure db
let db;
MongoClient.connect(url)
  .then((client) => {
    db = client.db(db_name);
    console.log("db is connected");
  })
  .catch((err) => {
    console.log(err);
  });

// app listens
app.listen(3000, () => {
  console.log("App is running on port 3000.");
});

// ROUTES
app.get("/", (req, res) => {
  res.status(200).json({ msg: "welcome to the api" });
});

// get all categories
app.get("/categories", (req, res) => {
  let categories = [];
  db.collection("category")
    .find()
    .forEach((category) => {
      categories.push(category);
    })
    .then(() => {
      res.status(200).json({ categories: categories });
    });
});
