const express = require("express");
const itemsController = require("../controllers/itemsController");
const router = express.Router();

router.get("/", itemsController.itemsListGet);
router.get("/games", itemsController.itemsListGet);
router.get("/categories", itemsController.categoriesListGet);
router.get("/developers", itemsController.developersListGet);

module.exports = router;
