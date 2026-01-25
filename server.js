require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-2025";

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// БД
const pool = new Pool({
	user: process.env.DB_USER || "postgres",
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "ppg",
	password: process.env.DB_PASSWORD || "123",
	port: process.env.DB_PORT || 5050,
});

pool.connect((err) => {
	if (err) console.error("Ошибка подключения к БД:", err.stack);
	else console.log("Подключено к PostgreSQL");
});

// JWT проверка
const authenticateToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ error: "Токен нужен" });
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ error: "Плохой токен" });
		req.user = user;
		next();
	});
};

// === РУЧНАЯ РЕГИСТРАЦИЯ (email + password) ===
app.post("/api/register", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: "Нужны email и пароль" });
	try {
		const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
		if (exists.rows.length) return res.status(400).json({ error: "Пользователь существует" });

		const hash = await bcrypt.hash(password, 12);

		// ❗ НЕ указываем id — он сгенерируется автоматически
		const result = await pool.query("INSERT INTO users (email, password, role, provider) VALUES ($1,$2,'user','email') RETURNING id,email,role", [email, hash]);

		res.status(201).json({ message: "Зареган!", user: result.rows[0] });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Ошибка сервера" });
	}
});

// === РУЧНОЙ ЛОГИН (email + password) ===
app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: "Нужны email и пароль" });
	try {
		const usr = await pool.query("SELECT * FROM users WHERE email=$1 AND provider='email'", [email]);
		if (!usr.rows.length) return res.status(400).json({ error: "Неправильный логин/пароль" });
		const user = usr.rows[0];
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(400).json({ error: "Неправильный логин/пароль" });
		const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
		res.json({ message: "Залогинился!", token, user: { id: user.id, email: user.email, role: user.role } });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Ошибка сервера" });
	}
});

// === ПРОФИЛЬ (для JWT-пользователей) ===
app.get("/api/me", authenticateToken, async (req, res) => {
	const u = await pool.query("SELECT id,email,role,name,picture,provider FROM users WHERE id=$1", [req.user.id]);
	if (u.rows.length === 0) return res.status(404).json({ error: "Пользователь не найден" });
	res.json(u.rows[0]);
});

// === СОЗДАНИЕ/ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ (для Google и гостей) ===
app.post("/api/users", async (req, res) => {
	const { id, name, email, picture, provider = "google" } = req.body;
	if (!id) return res.status(400).json({ error: "ID обязателен" });

	try {
		const query = `
			INSERT INTO users (id, name, email, picture, provider)
			VALUES ($1, $2, $3, $4, $5)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				email = EXCLUDED.email,
				picture = EXCLUDED.picture
			RETURNING id, name, email, picture, provider;
		`;
		const values = [id, name || null, email || null, picture || null, provider];
		const result = await pool.query(query, values);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Не удалось сохранить пользователя" });
	}
});

// === УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (по ID) ===
app.delete("/api/users", async (req, res) => {
	const { id } = req.query;
	if (!id) return res.status(400).json({ error: "ID не указан" });
	try {
		await pool.query("DELETE FROM users WHERE id = $1", [id]);
		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Ошибка удаления" });
	}
});

// === ТЕСТ ===
app.get("/api/test", (req, res) => res.json({ message: "Бэкенд жив!" }));

// Запуск
app.listen(PORT, () => {
	console.log(`\nСервер запущен → http://localhost:${PORT}`);
	console.log(`Тест: http://localhost:${PORT}/api/test\n`);
});
