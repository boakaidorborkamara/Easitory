const { ObjectId } = require("mongodb");
const { connectDB } = require("../dbConfig");
const axios = require("axios");

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
      // res.status(200).json(items);
      console.log(items);
      res.render("pages/items", { items: items });
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
      // res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
    });

  res.render("pages/items-details");
};

const displayNewItemForm = (req, res) => {
  let categories = [];

  db.collection("category")
    .find()
    .forEach((category) => {
      categories.push(category);
    })
    .then(() => {
      // convert all id to string before sending to the fronend
      categories.forEach((ele) => {
        ele._id = ele._id.toString();
      });

      res.render("pages/add-item", { categories: categories });
    });
};

const addItem = [
  (req, res, next) => {
    const fs = require("fs");
    const path = require("path");
    const { Buffer } = require("buffer");

    let new_item = req.body;
    let base64_data = new_item.image.file_data;

    // get data string from base64_data text by splitting and removing un-needed strings
    base64_data = base64_data.split(";");
    base64_data = base64_data[1];
    base64_data = base64_data.split(",");
    base64_data = base64_data[1];

    // convert base64_string to binary data
    let buff = Buffer.from(base64_data, "base64");

    // create unique filename for each file by including the date the file was uploaded
    let file_path = "./Public/images/uploads/";
    let date_created = Date.now();
    let new_item_image = new_item.image.file_details.name;

    // remove white spaces from file name
    new_item_image = new_item_image.split(" ");
    new_item_image = new_item_image.join("-");

    let image_path = `/images/uploads/${date_created}-${new_item_image}`;
    let file_name = `${file_path}${date_created}-${new_item_image}`;

    // create a new file from binary data
    fs.writeFileSync(file_name, buff);
    console.log(
      "Base64 image data converted to file: stack-abuse-logo-out.png"
    );

    // modify request body
    req.body.image = image_path;

    // call next middleware to upload data to db after creating the file
    next();
  },
  (req, res) => {
    let new_item = req.body;
    console.log(req.body);
    // res.status(200).json({ msg: "received" });

    db.collection("items")
      .insertOne(new_item)
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      });
  },
];

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
  displayNewItemForm,
  addItem,
  editItem,
  deleteItem,
};
