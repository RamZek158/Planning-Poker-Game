require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const migrationsDir = path.join(__dirname, "migrations");
const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
	console.error("DATABASE_URL is required");
	process.exit(1);
}

const pool = new Pool({
	connectionString: databaseUrl,
	ssl: databaseUrl ? { rejectUnauthorized: false } : false,
});

const run = async () => {
	const files = fs
		.readdirSync(migrationsDir)
		.filter((file) => file.endsWith(".sql"))
		.sort();

	console.log("[migrate] Database config: DATABASE_URL");

	if (!files.length) {
		console.log("[migrate] No SQL migrations found");
		return;
	}

	for (const file of files) {
		const fullPath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(fullPath, "utf8");

		await pool.query(sql);
		console.log(`[migrate] Applied ${file}`);
	}

	console.log("[migrate] All migrations completed successfully");
};

run()
	.catch((error) => {
		console.error("[migrate] Failed:", error.message);
		process.exitCode = 1;
	})
	.finally(async () => {
		await pool.end();
	});
