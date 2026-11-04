const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const lengthErr = "must be between 1 and 150 characters.";
const numErr = "must be a number";
const releaseErr = "must be a valid year between 1900 and 2026";
const stockErr = "must be between 1 and 150";

const validateUser = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage(`Name ${lengthErr}`)
    .notEmpty()
    .withMessage("Name cannot be empty"),
  body("price")
    .trim()
    .isNumeric()
    .withMessage(`Price ${numErr}`)
    .notEmpty()
    .withMessage("Price cannot be empty"),
  body("stock")
    .trim()
    .isNumeric()
    .withMessage(`Stock ${numErr}`)
    .isInt({ min: 1, max: 150 })
    .withMessage(`Stock ${stockErr}`)
    .notEmpty()
    .withMessage("Stock cannot be empty"),
  body("release")
    .trim()
    .isNumeric()
    .withMessage(`Release ${releaseErr}`)
    .isInt({ min: 1900, max: 2026 })
    .withMessage(`Release ${releaseErr}`)
    .notEmpty()
    .withMessage("Release year cannot be empty"),
  body("platform")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage(`Platform ${lengthErr}`)
    .notEmpty()
    .withMessage("Platform cannot be empty"),
];

exports.getAddGame = async (req, res) => {
  try {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);
    res.render("add-games", {
      title: "Add",
      categories,
      developers,
      formData: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading game creation page");
  }
};

exports.getEditGame = async (req, res) => {
  //console.log("edit");
  try {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);

    const result = await db.getGameById(req.params.id);
    const category = await db.getCategory(req.params.id);
    const selectedDeveloper = await db.getDeveloper(req.params.id);

    //console.log(selectedDeveloper[0].supplier_id);

    const selectedCat = [];

    category.forEach((category) => selectedCat.push(category.category_id));

    //console.log(selectedCat);
    //const id = req.params.id;
    //console.log(result[0]);

    res.render("edit-games", {
      title: "Edit",
      categories,
      developers,
      selectedCat,
      selectedDeveloper,
      formData: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading game edit page");
  }
};
/*
exports.addGame = async (req, res) => {
  console.log(req.body);
  db.insertGame(
    req.body.name,
    req.body.platform,
    req.body.release,
    req.body.price,
    req.body.stock,
    req.body.category,
    req.body.developer,
  )
    .then((result) => res.redirect("/"))
    .catch((err) => console.log(err));
};
*/
exports.addGame = [
  validateUser,
  async (req, res) => {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("add-games", {
        title: "Add",
        errors: errors.array(),
        categories,
        developers,
        formData: req.body,
      });
    }
    const { name, platform, release, price, stock } = matchedData(req);
    db.insertGame(
      req.body.name,
      req.body.platform,
      req.body.release,
      req.body.price,
      req.body.stock,
      req.body.category,
      req.body.developer,
    )
      .then((result) => res.redirect("/"))
      .catch((err) => console.log(err));
  },
];

exports.editGame = [
  validateUser,
  async (req, res) => {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("edit-games", {
        title: "Edit",
        errors: errors.array(),
        categories,
        developers,
        selectedCat: req.body.category || [],
        selectedDeveloper: req.body.developer || [],
        formData: req.body,
      });
    }
    const { name, platform, release, price, stock } = matchedData(req);
    db.editGame(
      req.body.id,
      req.body.name,
      req.body.platform,
      req.body.release,
      req.body.price,
      req.body.stock,
      req.body.category,
      req.body.developer,
    )
      .then((result) => res.redirect("/"))
      .catch((err) => {
        //console.log(req.body);
        console.log(err);
      });
  },
];

exports.deleteGame = async (req, res) => {
  db.deleteGame(req.params.id)
    .then((result) => {
      res.redirect("/");
      //console.log(req.params.id);
    })
    .catch((err) => {
      console.log(err);
    });
};
