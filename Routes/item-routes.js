const Express = require("express");
const router = Express.Router();
const { ObjectId } = require("mongodb");
const { connectDB } = require("../dbConfig");

// connect to database
let db;
connectDB((db_client, err) => {
  // don't update db variable when there's an err
  if (err) {
    console.log(err);
    return;
  }

  // update db variable when connection is successful
  db = db_client;
  console.log("db connection", db.createCollection);

  db.createCollection("items", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

// get all items
router.get("/item", (req, res) => {
  console.log("getting all items ....");
  let items = [];

  db.collection("items")
    .find()
    .forEach((item) => {
      items.push(item);
      console.log(item);
    })
    .then(() => {
      res.status(200).json(items);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/item/:id", (req, res) => {
  let item_id = req.params.id;

  db.collection("items")
    .findOne({ _id: new ObjectId(item_id) })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/item", (req, res) => {
  let new_item = req.body;
  console.log("new item", new_item);
  db.collection("items")
    .insertOne(new_item)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    });
});

router.delete("/item/:id", (req, res) => {
  let id = req.params.id;
  db.collection("items")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
});

module.exports = { router };
