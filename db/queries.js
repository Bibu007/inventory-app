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

async function insertGame(
  name,
  platform,
  release,
  price,
  stock,
  categories,
  developer,
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert game
    const result = await client.query(
      `INSERT INTO games
       (name, platform, release_year, price, stock_quantity)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, platform, release, price, stock],
    );

    const gameId = result.rows[0].id;
    const categoryIds = [];

    for (const category of categories) {
      const result = await client.query(
        `SELECT id FROM categories WHERE name = $1`,
        [category],
      );
      categoryIds.push(result.rows[0].id);
    }

    // Insert category associations
    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO game_categories (game_id, category_id)
         VALUES ($1, $2)`,
        [gameId, categoryId],
      );
    }

    const resultD = await client.query(
      `SELECT id FROM suppliers WHERE name = $1`,
      [developer],
    );

    const developerId = resultD.rows[0].id;

    await client.query(
      `INSERT INTO game_suppliers (game_id, supplier_id)
         VALUES ($1, $2)`,
      [gameId, developerId],
    );

    await client.query("COMMIT");

    return gameId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getAllGames,
  getAllCategories,
  getAllDevelopers,
  insertGame,
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
