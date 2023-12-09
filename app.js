const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
let db_name = "easitoryDB";

// init app and middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
      console.log(categories);
      res.status(200).json({ categories: categories });
    });
});

// get category details
app.get("/categories/:id", (req, res) => {
  let id = req.params.id;
  console.log("id", id);

  if (!ObjectId.isValid) {
    db.collection("category")
      .findOne({ _id: new ObjectId(id) })
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(500).json({ msg: "invalid ID" });
  }
});

//add new category
app.post("/categories", (req, res) => {
  let new_category = req.body;

  db.collection("category")
    .insertOne(new_category)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
