const Express = require("express");
const router = Express.Router();
const categoryController = require("../Controller/itemController");

// get all items
router.get("/items", categoryController.getItems);

router.get("/items/add", categoryController.displayNewItemForm);

router.get("/items/:id", categoryController.getItemDetails);

router.post("/items", categoryController.addItem);

router.put("/items/:id", categoryController.editItem);

router.delete("/items/:id", categoryController.deleteItem);

module.exports = { router };
