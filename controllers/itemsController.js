const db = require("../db/queries");

exports.itemsListGet = (req, res) => {
  db.getAllGames()
    .then((result) => {
      //console.log(result);
      res.render("index", {
        title: "Items",
        games: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.categoriesListGet = (req, res) => {
  db.getAllCategories()
    .then((result) => {
      //console.log(result);
      res.render("categories", {
        title: "Categories",
        categories: result,
        error: null,
        check: db.checkCategory,
      });
    })
    .catch((err) => console.log(err));
};

exports.developersListGet = (req, res) => {
  db.getAllDevelopers()
    .then((result) => {
      //console.log(result);
      res.render("developers", { title: "Developers", developers: result });
    })
    .catch((err) => console.log(err));
};
