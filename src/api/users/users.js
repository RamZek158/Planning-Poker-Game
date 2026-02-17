app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const usr = await pool.query(
			"SELECT * FROM users WHERE email=$1 AND provider='email'",
			[email],
		);

		if (!usr.rows.length)
			return res.status(400).json({ error: "Invalid credentials" });

		const user = usr.rows[0];
		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return res.status(400).json({ error: "Invalid credentials" });

		// 🔥 Возвращаем то же, что и при регистрации:
		res.json({
			success: true,
			token: generateAccessToken(user), // ← "token", а не "accessToken"
			user: {
				id: user.id,
				email: user.email,
				user_name: user.name, // ← Маппим name → user_name
				user_picture: user.picture,
				role: user.role,
			},
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Server error" });
	}
});
