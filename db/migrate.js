require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const migrationsDir = path.join(__dirname, "migrations");
const databaseUrl = process.env.DATABASE_URL?.trim();
const usingDatabaseUrl = Boolean(databaseUrl);
const poolConfig = usingDatabaseUrl
	? {
			connectionString: databaseUrl,
			ssl:
				process.env.NODE_ENV === "production"
					? { rejectUnauthorized: false }
					: false,
		}
	: {
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			password: process.env.DB_PASSWORD,
			port: Number(process.env.DB_PORT || 5432),
		};

const pool = new Pool(poolConfig);

const run = async () => {
	const files = fs
		.readdirSync(migrationsDir)
		.filter((file) => file.endsWith(".sql"))
		.sort();

	console.log(
		`[migrate] Database config: ${
			usingDatabaseUrl ? "DATABASE_URL" : "DB_* fallback"
		}`,
	);

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
