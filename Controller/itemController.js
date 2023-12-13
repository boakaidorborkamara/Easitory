const { ObjectId } = require("mongodb");
const { connectDB } = require("../dbConfig");

// configure db
let db;
connectDB((db_client, err) => {
  // don't update db variable when there's an err
  if (err) {
    console.log(err);
    return;
  }

  // update db variable when connection is successful
  db = db_client;
});

const getItems = (req, res) => {
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
};

const getItemDetails = (req, res) => {
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
};

const addItem = (req, res) => {
  let new_item = req.body;
  console.log("new item", new_item);
  db.collection("items")
    .insertOne(new_item)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    });
};

const editItem = (req, res) => {
  let query = { id: req.params.id };
  let new_values = { $set: req.body };

  console.log("query", query);

  db.collection("items")
    .updateOne(query, new_values)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteItem = (req, res) => {
  let id = req.params.id;
  db.collection("items")
    .deleteOne({ id: id })
    .then((result) => {
      console.log("RESULT", result);
      res.status(200).json(result);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });
};

module.exports = {
  getItems,
  getItemDetails,
  addItem,
  editItem,
  deleteItem,
};