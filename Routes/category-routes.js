const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/categoryController");

// ROUTES
router.get("/", categoryController.index);

// get all categories
router.get("/categories", categoryController.getCategories);

// get all categories
router.get("/categories/add", categoryController.displayNewCategoryForm);

// get category details
router.get("/categories/:id", categoryController.getCategoryDetails);

//add new category
router.post("/categories", categoryController.addCategory);

// edit specific category
router.put("/categories/:id", categoryController.editCategory);

// delete specific category
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = { router };
