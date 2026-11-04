const express = require("express");
const itemsController = require("../controllers/itemsController");
const gamesController = require("../controllers/gamesController");
const router = express.Router();

router.get("/", itemsController.itemsListGet);
router.get("/add", gamesController.getAddGame);
router.post("/add", gamesController.addGame);
router.get("/edit/:id", gamesController.getEditGame);
router.post("/edit", gamesController.editGame);
router.get("/delete/:id", gamesController.deleteGame);
router.get("/developers", itemsController.developersListGet);

module.exports = router;
