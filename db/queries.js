const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query(`SELECT
    g.id,
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
  //console.log("Heyy");
  //console.log(rows);
  return rows;
}

async function getGameById(id) {
  const { rows } = await pool.query(`SELECT * FROM games WHERE id = $1`, [id]);
  return rows;
}

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories;");
  return rows;
}

module.exports = {
  getAllGames,
  getAllCategories,
};

async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM suppliers;");
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

async function getCategory(id) {
  const result = await pool.query(
    `SELECT category_id FROM game_categories WHERE game_id = $1`,
    [id],
  );
  return result.rows;
}

async function getDeveloper(id) {
  const result = await pool.query(
    `SELECT supplier_id FROM game_suppliers WHERE game_id = $1`,
    [id],
  );
  return result.rows;
}

async function editGame(
  id,
  name,
  platform,
  release,
  price,
  stock,
  categories,
  developer,
) {
  const client = await pool.connect();
  //console.log(`id: ${id}`);
  categories = Array.isArray(categories) ? categories : [categories];
  try {
    await client.query("BEGIN");

    // Insert game
    await client.query(
      `UPDATE games
       SET name = $1, platform = $2, release_year = $3, price = $4, stock_quantity = $5
       WHERE id = $6`,
      [name, platform, release, price, stock, id],
    );

    //const gameId = result.rows[0].id;
    const categoryIds = [];

    await client.query(`DELETE FROM game_categories WHERE game_id = $1`, [id]);

    for (const category of categories) {
      //console.log(category);
      const result = await client.query(
        `SELECT id FROM categories WHERE name = $1`,
        [category],
      );
      //console.log(result);
      categoryIds.push(result.rows[0].id);
    }

    // Insert category associations
    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO game_categories (game_id, category_id)
         VALUES ($1, $2)`,
        [id, categoryId],
      );
    }

    await client.query(`DELETE FROM game_suppliers WHERE game_id = $1`, [id]);

    const resultD = await client.query(
      `SELECT id FROM suppliers WHERE name = $1`,
      [developer],
    );

    const developerId = resultD.rows[0].id;

    await client.query(
      `INSERT INTO game_suppliers (game_id, supplier_id)
         VALUES ($1, $2)`,
      [id, developerId],
    );

    await client.query("COMMIT");

    //return gameId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteGame(id) {
  const client = await pool.connect();
  //console.log(`id: ${id}`);

  try {
    await client.query("BEGIN");

    await client.query(`DELETE FROM games WHERE id = $1`, [id]);

    await client.query(`DELETE FROM game_categories WHERE game_id = $1`, [id]);

    await client.query(`DELETE FROM game_suppliers WHERE game_id = $1`, [id]);

    await client.query("COMMIT");

    //return gameId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function insertCategory(name) {
  pool
    .query(`INSERT INTO categories(name) VALUES ($1)`, [name])
    .then((res) => {})
    .catch((err) => console.log(err));
}

async function checkCategory(id) {
  try {
    const result = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM game_categories WHERE category_id = $1);`,
      [id],
    );
    return result.rows[0].exists;
  } catch (err) {
    console.log(err);
  }
}

async function deleteCategory(id) {
  //console.log(`id: ${id}`);

  try {
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);

    //return gameId;
  } catch (error) {
    console.log(err);
  }
}

module.exports = {
  getAllGames,
  getAllCategories,
  getAllDevelopers,
  insertGame,
  getGameById,
  getCategory,
  getDeveloper,
  editGame,
  deleteGame,
  insertCategory,
  checkCategory,
  deleteCategory,
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
