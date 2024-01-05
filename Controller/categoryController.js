const { ObjectId } = require("mongodb");
const { connectDB } = require("../dbConfig");
const { dirname } = require("path");

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

const index = (req, res) => {
  let categories = [];

  db.collection("category")
    .find()
    .forEach((category) => {
      category._id.toString();
      console.log(category._id);
      categories.push(category);
    })
    .then(() => {
      // convert all id to string before sending to the fronend
      categories.forEach((ele) => {
        ele._id = ele._id.toString();
      });

      res.render("pages/index", { categories: categories });
    });
};

const getCategories = (req, res) => {
  let categories = [];

  db.collection("category")
    .find()
    .forEach((category) => {
      category._id.toString();
      console.log(category._id);
      categories.push(category);
    })
    .then(() => {
      // convert all id to string before sending to the fronend
      categories.forEach((ele) => {
        ele._id = ele._id.toString();
      });

      res.render("pages/categories", { categories: categories });
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
          console.log("RESULT", result);
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

const displayNewCategoryForm = (req, res) => {
  res.render("pages/add-category");
};

const addCategory = [
  async (req, res, next) => {
    try {
      //modules
      const fs = require("fs");
      const path = require("path");
      const { Buffer } = require("buffer");

      // data from FrontEnd
      let new_category = req.body;
      let base64_data = new_category.image.file_data;

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
      let new_category_image = new_category.image.file_details.name;

      // remove white spaces from file name
      new_category_image = new_category_image.split(" ");
      new_category_image = new_category_image.join("-");

      let image_path = `/images/uploads/${date_created}-${new_category_image}`;
      let file_name = `${file_path}${date_created}-${new_category_image}`;

      // create a new file from binary data
      fs.writeFileSync(file_name, buff);
      console.log(
        "Base64 image data converted to file: stack-abuse-logo-out.png"
      );

      // modify request body
      req.body.image = image_path;
      console.log("new category", new_category);

      // call next middleware to upload data to db after creating the file
      next();
    } catch (err) {
      console.log("ERR", err);
      res.status(500).json("Error Uploading file");
    }
  },

  (req, res) => {
    console.log("req", req.body);

    let new_category = req.body;
    db.collection("category")
      .insertOne(new_category)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

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
  index,
  getCategories,
  displayNewCategoryForm,
  getCategoryDetails,
  addCategory,
  editCategory,
  deleteCategory,
};
