const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "cannot contain anything other than characters";
const lengthErr = "must be between 1 and 150 characters long";

const validateUser = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 150 })
    .withMessage(`Name ${lengthErr}`)
    .notEmpty()
    .withMessage("Name cannot be empty"),
];

exports.getAddCategory = (req, res) => {
  try {
    //nope
    res.render("add-category", { title: "Add category" });
  } catch {
    console.error(err);
    res.status(500).send("Error loading add category page");
  }
};

exports.addCategory = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("add-category", {
        title: "Add category",
        errors: errors.array(),
      });
    }
    const { name } = matchedData(req);
    db.insertCategory(req.body.name)
      .then((result) => res.redirect("/categories"))
      .catch((err) => console.log(err));
  },
];

exports.deleteCategory = async (req, res) => {
  db.checkCategory(req.params.id).then((result) => {
    if (result === false) {
      db.deleteCategory(req.params.id)
        .then((result) => {
          console.log("delete");
          res.redirect("/categories");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("No delete");
      res.redirect("/categories");
    }
  });
};
