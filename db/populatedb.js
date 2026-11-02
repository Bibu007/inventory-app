require("dotenv").config();
const { Client } = require("pg");

const SQL = `CREATE TABLE games (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    platform VARCHAR(50),
    release_year INTEGER,
    price NUMERIC(10, 2),
    stock_quantity INTEGER DEFAULT 0
);

CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE suppliers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20)
);

CREATE TABLE game_categories (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
);

CREATE TABLE game_suppliers (
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, supplier_id)
);

INSERT INTO games (name, platform, release_year, price, stock_quantity)
VALUES
('The Witcher 3: Wild Hunt', 'PC', 2015, 29.99, 15),
('Elden Ring', 'PC', 2022, 59.99, 20),
('God of War Ragnarok', 'PS5', 2022, 49.99, 12),
('Minecraft', 'PC', 2011, 26.95, 30),
('Grand Theft Auto V', 'PS5', 2013, 29.99, 18),
('Red Dead Redemption 2', 'PC', 2018, 39.99, 10),
('FIFA 25', 'PS5', 2024, 69.99, 25),
('Cyberpunk 2077', 'PC', 2020, 39.99, 14),
('Hades', 'PC', 2020, 24.99, 22),
('Hollow Knight', 'PC', 2017, 14.99, 16);

INSERT INTO categories (name)
VALUES
('Action'),
('Adventure'),
('RPG'),
('Open World'),
('Sports'),
('Simulation'),
('Survival'),
('Indie'),
('Strategy'),
('Platformer');

INSERT INTO suppliers (name, email, phone)
VALUES
('CD Projekt', 'contact@cdprojekt.com', '9876543210'),
('Bandai Namco', 'contact@bandainamco.com', '9876543211'),
('Sony Interactive Entertainment', 'contact@sony.com', '9876543212'),
('Mojang Studios', 'contact@mojang.com', '9876543213'),
('Rockstar Games', 'contact@rockstargames.com', '9876543214'),
('Electronic Arts', 'contact@ea.com', '9876543215'),
('Supergiant Games', 'contact@supergiantgames.com', '9876543216'),
('Team Cherry', 'contact@teamcherry.com', '9876543217');

INSERT INTO game_categories (game_id, category_id)

SELECT g.id, c.id
FROM (
    VALUES
    ('The Witcher 3: Wild Hunt', 'RPG'),
    ('The Witcher 3: Wild Hunt', 'Adventure'),
    ('The Witcher 3: Wild Hunt', 'Open World'),

    ('Elden Ring', 'Action'),
    ('Elden Ring', 'RPG'),
    ('Elden Ring', 'Adventure'),

    ('God of War Ragnarok', 'Action'),
    ('God of War Ragnarok', 'Adventure'),

    ('Minecraft', 'Simulation'),
    ('Minecraft', 'Survival'),
    ('Minecraft', 'Adventure'),

    ('Grand Theft Auto V', 'Action'),
    ('Grand Theft Auto V', 'Open World'),

    ('Red Dead Redemption 2', 'Action'),
    ('Red Dead Redemption 2', 'Adventure'),
    ('Red Dead Redemption 2', 'Open World'),

    ('FIFA 25', 'Sports'),

    ('Cyberpunk 2077', 'RPG'),
    ('Cyberpunk 2077', 'Action'),
    ('Cyberpunk 2077', 'Open World'),

    ('Hades', 'Action'),
    ('Hades', 'RPG'),
    ('Hades', 'Indie'),

    ('Hollow Knight', 'Action'),
    ('Hollow Knight', 'Indie'),
    ('Hollow Knight', 'Platformer')
) AS data(game_name, category_name)

JOIN games g ON g.name = data.game_name
JOIN categories c ON c.name = data.category_name;

INSERT INTO game_suppliers (game_id, supplier_id)

SELECT g.id, s.id
FROM (
    VALUES
    ('The Witcher 3: Wild Hunt', 'CD Projekt'),

    ('Elden Ring', 'Bandai Namco'),

    ('God of War Ragnarok', 'Sony Interactive Entertainment'),

    ('Minecraft', 'Mojang Studios'),

    ('Grand Theft Auto V', 'Rockstar Games'),
    ('Grand Theft Auto V', 'Sony Interactive Entertainment'),

    ('Red Dead Redemption 2', 'Rockstar Games'),

    ('FIFA 25', 'Electronic Arts'),

    ('Cyberpunk 2077', 'CD Projekt'),

    ('Hades', 'Supergiant Games'),

    ('Hollow Knight', 'Team Cherry')
) AS data(game_name, supplier_name)

JOIN games g ON g.name = data.game_name
JOIN suppliers s ON s.name = data.supplier_name;


`;

async function main() {
  console.log("Seeding database...");

  // Initialize the PostgreSQL client using the DATABASE_URL environment variable
  const client = new Client({
    connectionString: process.env.PSQL_URI,
    ssl: {
      rejectUnauthorized: false, // Required for secure connections to Render databases
    },
  });

  try {
    await client.connect();
    console.log("Connected to Render PostgreSQL database.");

    await client.query(SQL);
    console.log("Database populated successfully!");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

main();
