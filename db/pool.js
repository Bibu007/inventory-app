const { Pool } = require("pg");

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: process.env.PSQL_URI,
  ssl: {
    rejectUnauthorized: false, // Required for Render external connections
  },
});

if (process.env.PSQL_URI) {
  const url = new URL(process.env.PSQL_URI);
  console.log(`🔌 Connected to Database:`);
  console.log(`   - Host: ${url.hostname}`);
  console.log(`   - Port: ${url.port}`);
  console.log(`   - Database Name: ${url.pathname.replace("/", "")}`);
} else {
  console.log("⚠️ DATABASE_URL environment variable is not set!");
}
