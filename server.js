require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 8088;
const isProduction = process.env.NODE_ENV === "production";
const RAILWAY_APP_URL =
	"https://planning-poker-game-production-c411.up.railway.app";

/* =========================================================
	ENV VALIDATION
========================================================= */

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
	console.error("❌ JWT secrets missing in .env");
	process.exit(1);
}

/* =========================================================
	SECURITY
========================================================= */

// HTTP security headers
app.use(helmet());

// CORS
const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");
const corsOrigins = Array.from(
	new Set(
		[
			normalizeOrigin(process.env.CLIENT_URL),
			RAILWAY_APP_URL,
			"http://localhost:3000",
			"http://localhost:8080",
			"http://localhost:3001",
			"http://localhost:8088",
		].filter(Boolean),
	),
);

app.use(
	cors({
		origin(origin, callback) {
			const normalizedOrigin = normalizeOrigin(origin);
			if (!normalizedOrigin || corsOrigins.includes(normalizedOrigin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	}),
);

// JSON parser
app.use(express.json());

// rate limit для auth
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests, try later",
});

app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);

/* =========================================================
	DATABASE
========================================================= */

const usingDatabaseUrl = Boolean(process.env.DATABASE_URL);
const pool = new Pool(
	process.env.DATABASE_URL
		? {
				connectionString: process.env.DATABASE_URL,
				ssl: process.env.DATABASE_URL
					? { rejectUnauthorized: false }
					: false,
			}
		: {
				user: process.env.DB_USER,
				host: process.env.DB_HOST,
				database: process.env.DB_NAME,
				password: process.env.DB_PASSWORD,
				port: Number(process.env.DB_PORT || 5432),
				ssl: false,
			},
);
/* =========================================================
	JWT HELPERS
========================================================= */


const generateAccessToken = (user) =>
	jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: "15m",
	});

const generateRefreshToken = (user) =>
	jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: "30d",
	});

// middleware проверки JWT
const authenticateToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) return res.status(401).json({ error: "Token required" });

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ error: "Invalid token" });

		req.user = user;
		next();
	});
};

const resolveRequestActor = (req) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (token) {
		try {
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (e) {
			// Allow owner fallback for legacy sessions with expired access tokens.
		}
	}

	const userId = req.headers["x-user-id"];
	if (userId) {
		return { id: userId, role: "user" };
	}

	return null;
};

/* =========================================================
	AUTH
========================================================= */

/**
 * Регистрация пользователя
 */
app.post("/api/register", async (req, res) => {
	const { email, password, name } = req.body; // ← name теперь опционален

	if (!email || !password)
		return res.status(400).json({ error: "Email & password required" });

	try {
		const exists = await pool.query("SELECT id FROM users WHERE email=$1", [
			email,
		]);
		if (exists.rows.length)
			return res.status(400).json({ error: "User exists" });

		const hash = await bcrypt.hash(password, 12);

		// 🔥 Если name не передан — берём часть email до @
		const userName = name || email.split("@")[0];

		const result = await pool.query(
			`INSERT INTO users (id, email, password, name, role, provider)
       VALUES ($1, $2, $3, $4, 'user', 'email')
       RETURNING id, email, name, picture, role`,
			[uuidv4(), email, hash, userName],
		);

		const newUser = result.rows[0];

		// 🔥 Возвращаем ТО, что ждёт фронтенд:
		res.status(201).json({
			success: true,
			token: generateAccessToken(newUser), // ← именно "token", не "accessToken"
			refreshToken: generateRefreshToken(newUser),
			user: {
				id: newUser.id,
				email: newUser.email,
				user_name: newUser.name, // ← маппим name → user_name
				user_picture: newUser.picture, // ← может быть null — это ок
				role: newUser.role,
			},
		});
	} catch (e) {
		console.error("Register error:", e);
		res.status(500).json({ error: "Server error" });
	}
});

/**
 * Логин пользователя
 */
app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const usr = await pool.query(
			"SELECT id, email, password, name, picture, role FROM users WHERE email=$1 AND provider='email'",
			[email],
		);

		if (!usr.rows.length)
			return res.status(400).json({ error: "Invalid credentials" });

		const user = usr.rows[0];
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(400).json({ error: "Invalid credentials" });

		// 🔥 Возвращаем ТО, что ждёт фронтенд:
		res.json({
			success: true,
			token: generateAccessToken(user), // ← "token", а не "accessToken"
			refreshToken: generateRefreshToken(user),
			user: {
				id: user.id,
				email: user.email,
				user_name: user.name, // ← может быть null
				user_picture: user.picture, // ← может быть null
				role: user.role,
			},
		});
	} catch (e) {
		console.error("Login error:", e);
		res.status(500).json({ error: "Server error" });
	}
});

/**
 * Обновление access токена
 */
app.post("/api/refresh", (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken)
		return res.status(401).json({ error: "Refresh token required" });

	jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
		if (err) return res.status(403).json({ error: "Invalid refresh token" });

		const token = generateAccessToken({ id: user.id, role: "user" });
		res.json({
			token,
			accessToken: token,
		});
	});
});

/**
 * Получить профиль текущего пользователя
 */
app.get("/api/me", authenticateToken, async (req, res) => {
	const u = await pool.query(
		"SELECT id,email,role,name,picture,provider FROM users WHERE id=$1",
		[req.user.id],
	);

	res.json(u.rows[0]);
});

/* =========================================================
	GAME SETTINGS (ROOMS)
========================================================= */

/**
 * Создать или обновить комнату
 */
app.post("/api/save-game-settings", async (req, res) => {
	const { id, userId, name, votingType } = req.body;

	try {
		await pool.query(
			`
			INSERT INTO game_settings (id,user_id,name,voting_type)
			VALUES ($1,$2,$3,$4)
			ON CONFLICT (id) DO UPDATE SET
				name = EXCLUDED.name,
				voting_type = EXCLUDED.voting_type
			`,
			[id, userId, name, votingType],
		);

		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Ошибка сохранения игры" });
	}
});

/**
 * Получить комнату по ID
 */
app.get("/api/game-settings/:id", async (req, res) => {
	const { id } = req.params;

	const result = await pool.query(
		"SELECT * FROM game_settings WHERE id=$1 AND is_deleted=false",
		[id],
	);

	res.json(result.rows[0]);
});

/**
 * Обновить активность комнаты
 */
app.post("/api/game-settings/activity/:id", async (req, res) => {
	await pool.query("UPDATE game_settings SET last_activity=NOW() WHERE id=$1", [
		req.params.id,
	]);

	res.json({ ok: true });
});

/**
 * Удалить комнату (soft delete)
 * Используется кнопкой "Закрыть игру"
 */
app.delete("/api/game-settings/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const actor = resolveRequestActor(req);
		if (!actor) {
			return res.status(401).json({ error: "Token or user id required" });
		}

		const room = await pool.query(
			"SELECT user_id FROM game_settings WHERE id=$1 AND is_deleted=false",
			[id],
		);
		if (!room.rows.length) {
			return res.status(404).json({ error: "Комната не найдена" });
		}

		const ownerId = room.rows[0].user_id;
		if (actor.id !== ownerId && actor.role !== "admin") {
			return res.status(403).json({ error: "Forbidden" });
		}

		await pool.query("UPDATE game_settings SET is_deleted=true WHERE id=$1", [
			id,
		]);

		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Ошибка удаления комнаты" });
	}
});

/* =========================================================
	AUTO CLEANUP
========================================================= */

/**
 * Автоочистка старых комнат (16 дней)
 * Работает раз в сутки
 */
const CLEANUP_INTERVAL = 1000 * 60 * 60 * 24;

setInterval(async () => {
	try {
		await pool.query(`
			DELETE FROM game_settings
			WHERE created_at < NOW() - INTERVAL '16 days'
		`);

		console.log("🧹 Old game rooms cleaned (16+ days)");
	} catch (e) {
		console.error("Cleanup error:", e);
	}
}, CLEANUP_INTERVAL);

/* =========================================================
	USERS
========================================================= */

/**
 * Получить список пользователей
 */
app.get("/api/users", async (req, res) => {
	const users = await pool.query("SELECT id,name,email FROM users");
	res.json(users.rows);
});

/**
 * Удалить пользователя (сам или админ)
 */
app.delete("/api/users/:id", authenticateToken, async (req, res) => {
	const { id } = req.params;

	if (req.user.id !== id && req.user.role !== "admin")
		return res.status(403).json({ error: "Forbidden" });

	await pool.query("DELETE FROM users WHERE id=$1", [id]);
	res.json({ success: true });
});

/* =========================================================
	TEST
========================================================= */

app.get("/api/test", (req, res) => res.json({ message: "Backend alive" }));

app.get("/api/db-test", async (req, res) => {
	try {
		const result = await pool.query("SELECT NOW() AS time");
		res.json({ ok: true, time: result.rows[0].time });
	} catch (error) {
		console.error("DB test error:", error);
		res
			.status(500)
			.json({ ok: false, error: error.code || "Database unavailable" });
	}
});

/* =========================================================
	START SERVER & WEBSOCKETS (SOCKET.IO)
========================================================= */
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

// Настраиваем Socket.IO с CORS
const io = new Server(server, {
	cors: {
		origin: corsOrigins,
		credentials: true,
	},
	allowRequest: (req, callback) => {
		const normalizedOrigin = normalizeOrigin(req.headers.origin);
		if (!normalizedOrigin || corsOrigins.includes(normalizedOrigin)) {
			return callback(null, true);
		}

		return callback("Not allowed by CORS", false);
	},
});

// Хранилище состояний комнат в памяти сервера
// Формат: { roomId: { users: [{id, name}], votes: {userId: {value}}, showAllVotes: false } }
const roomsState = {};

const isRoomAdmin = async (roomId, userId) => {
	try {
		const room = await pool.query(
			"SELECT user_id FROM game_settings WHERE id=$1 AND is_deleted=false",
			[roomId],
		);
		if (!room.rows.length) return false;
		return room.rows[0].user_id === userId;
	} catch (e) {
		console.error("Room admin check error:", e);
		return false;
	}
};

io.on("connection", (socket) => {
	console.log(`🔌 Участник подключился: ${socket.id}`);

	// 1. Присоединение к комнате
	socket.on("join_room", ({ roomId, user, token }) => {
		let effectiveUserId = user.id;
		if (token) {
			try {
				const payload = jwt.verify(token, process.env.JWT_SECRET);
				effectiveUserId = payload.id;
			} catch (e) {
				console.warn("Socket join with invalid token");
			}
		}

		const safeUser = { ...user, id: effectiveUserId };

		socket.join(roomId);
		socket.userId = effectiveUserId;
		socket.roomId = roomId;

		// Инициализируем комнату, если её ещё нет
		if (!roomsState[roomId]) {
			roomsState[roomId] = { users: [], votes: {}, showAllVotes: false };
		}

		const room = roomsState[roomId];

		// Добавляем юзера, если его там нет
		if (!room.users.find((u) => u.id === safeUser.id)) {
			room.users.push(safeUser);
		}

		// Отправляем подключившемуся текущее состояние комнаты
		socket.emit("room_state", room);

		// Оповещаем остальных, что список юзеров обновился
		socket.to(roomId).emit("users_update", room.users);
	});

	// 2. Игрок голосует
	socket.on("vote", ({ roomId, userId, value }) => {
		if (roomsState[roomId]) {
			roomsState[roomId].votes[userId] = { value };
			// Рассылаем всем в комнате новые голоса
			io.to(roomId).emit("votes_update", roomsState[roomId].votes);
		}
	});

	// 3. Админ показывает карты
	socket.on("show_cards", async ({ roomId }) => {
		if (roomsState[roomId] && (await isRoomAdmin(roomId, socket.userId))) {
			roomsState[roomId].showAllVotes = true;
			io.to(roomId).emit("cards_revealed");
		}
	});

	// 4. Админ перезапускает игру
	socket.on("restart_game", async ({ roomId }) => {
		if (roomsState[roomId] && (await isRoomAdmin(roomId, socket.userId))) {
			roomsState[roomId].votes = {};
			roomsState[roomId].showAllVotes = false;
			io.to(roomId).emit("game_restarted");
		}
	});

	// 5. Отключение юзера (закрыл вкладку)
	socket.on("disconnect", () => {
		const { roomId, userId } = socket;
		if (roomId && roomsState[roomId]) {
			// Удаляем юзера из комнаты
			roomsState[roomId].users = roomsState[roomId].users.filter(
				(u) => u.id !== userId,
			);

			// Сообщаем остальным, что он ушел
			io.to(roomId).emit("users_update", roomsState[roomId].users);

			// Очищаем комнату, если там никого не осталось
			if (roomsState[roomId].users.length === 0) {
				delete roomsState[roomId];
			}
		}
		console.log(`❌ Участник отключился: ${socket.id}`);
	});
});

// ЗАПУСК СЕРВЕРА! Обрати внимание, теперь мы запускаем `server.listen`, а не `app.listen`
server.listen(PORT, () => {
	console.log(
		"Database mode:",
		usingDatabaseUrl ? "DATABASE_URL" : "DB_HOST",
	);
	console.log("CLIENT_URL:", process.env.CLIENT_URL);
	console.log("Allowed CORS origins:", corsOrigins);
	console.log(`[startup] API port: ${PORT}`);
	console.log(
		isProduction
			? `🚀 Server & WebSockets running on internal port ${PORT}`
			: `🚀 Server & WebSockets running → http://localhost:${PORT}`,
	);
});
