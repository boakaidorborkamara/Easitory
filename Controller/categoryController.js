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

const getCategories = (req, res) => {
  let categories = [];

  db.collection("category")
    .find()
    .forEach((category) => {
      categories.push(category);
    })
    .then(() => {
      res.status(200).json({ categories: categories });
    });
};

const getCategoryDetails = (req, res) => {
  let id = req.params.id;
  console.log("id", id);

  if (ObjectId.isValid) {
    db.collection("category")
      .findOne({ _id: new ObjectId(id) })
      .then((result) => {
        // sent category details if category is in db
        if (result !== null) {
          res.status(200).json(result);
        } else {
          res.status(500).json({ msg: "Category doesn't exists." });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(500).json({ msg: "invalid ID" });
  }
};

const addCategory = (req, res) => {
  let new_category = req.body;

  db.collection("category")
    .insertOne(new_category)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

const editCategory = (req, res) => {
  let query = { id: req.params.id };
  let new_values = { $set: req.body };

  // console.log("id", req.params.id);
  // console.log("new values", new_values);

  db.collection("category")
    .updateOne(query, new_values)
    .then((err, res) => {
      if (err) {
        console.log("ERR", err);
        res.status(500).json(err);
      } else {
        console.log("RES", res);
      }
    })
    .catch((err) => {
      console.log("ERR", err);
    });
};

const deleteCategory = (req, res) => {
  console.log("deleting...");
  let id = req.params.id;
  db.collection("category")
    .deleteOne({ _id: new ObjectId(id) })
    .then((err) => {
      if (err) {
        console.log("ERR", err);
        res.status(500).json(err);
      } else {
        res.status(200).json({ msg: "Category deleted" });
      }
    });
};

module.exports = {
  getCategories,
  getCategoryDetails,
  addCategory,
  editCategory,
  deleteCategory,
};
