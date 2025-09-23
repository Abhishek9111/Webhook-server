import postgres from "postgres";

export async function runMigrations(sql: postgres.Sql) {
  try {
    console.log("Creating users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log("Creating profiles table...");
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Table creation failed:", error);
    throw error;
  }
}
