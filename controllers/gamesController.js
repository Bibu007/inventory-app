const db = require("../db/queries");

exports.getAddGame = async (req, res) => {
  try {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);
    res.render("add-games", {
      title: "Items",
      categories,
      developers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading game creation page");
  }
};

exports.getEditGame = async (req, res) => {
  try {
    const [developers, categories] = await Promise.all([
      db.getAllDevelopers(),
      db.getAllCategories(),
    ]);
    res.render("edit-games", {
      title: "Items",
      categories,
      developers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading game edit page");
  }
};

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
