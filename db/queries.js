const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(`SELECT
    g.name,
    g.price,
    g.stock_quantity,
    (
        SELECT STRING_AGG(c.name, ', ')
        FROM game_categories gc
        JOIN categories c ON c.id = gc.category_id
        WHERE gc.game_id = g.id
    ) AS categories,
    (
        SELECT STRING_AGG(s.name, ', ')
        FROM game_suppliers gs
        JOIN suppliers s ON s.id = gs.supplier_id
        WHERE gs.game_id = g.id
    ) AS suppliers
FROM games g;`);
  console.log("Heyy");
  console.log(rows);
  return rows;
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT name FROM categories;");
  return rows;
}

module.exports = {
  getAllGames,
  getAllCategories,
};

async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT name FROM suppliers;");
  return rows;
}

module.exports = {
  getAllGames,
  getAllCategories,
  getAllDevelopers,
};

/*'SELECT
      g.name,
      g.price,
      g.stock_quantity,
      (
          SELECT), STRING_AGG(c.name, ', '),
      FROM, game_categories, gc,
      JOIN, categories, c, ON, c.id = gc.category_id,
      WHERE, gc.game_id = g.id
  ) AS categories,
    (
        SELECT STRING_AGG(s.name, ', ')
        FROM game_suppliers gs
        JOIN suppliers s ON s.id = gs.supplier_id
        WHERE gs.game_id = g.id
    ) AS suppliers
FROM games g;`*/
