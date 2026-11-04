const express = require("express");
const itemsController = require("../controllers/itemsController");
const categoriesController = require("../controllers/categoriesController");
const router = express.Router();

router.get("/", itemsController.categoriesListGet);
router.get("/add", categoriesController.getAddCategory);
router.post("/add", categoriesController.addCategory);
router.get("/delete/:id", categoriesController.deleteCategory);

module.exports = router;
