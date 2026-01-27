// src/pages/Account/Account.jsx
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Account.css";

const Account = () => {
	const [cookies, , removeCookie] = useCookies(["logged-user-info"]);
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const user = cookies["logged-user-info"];

	// ⛔ если нет куки — сразу на главную
	useEffect(() => {
		if (!user) navigate("/");
	}, [user, navigate]);

	// 🔐 загрузка профиля через JWT
	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.jwt) {
				setProfile(user); // Google-пользователь (без JWT)
				setLoading(false);
				return;
			}

			try {
				const res = await axios.get("/api/me", {
					headers: {
						Authorization: `Bearer ${user.jwt}`,
					},
				});
				setProfile(res.data);
			} catch (err) {
				console.error(err);
				setError("Сессия истекла");
				removeCookie("logged-user-info", { path: "/" });
				navigate("/");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [user, navigate, removeCookie]);

	const handleLogout = () => {
		removeCookie("logged-user-info", { path: "/" });
		navigate("/");
	};

	if (loading) return <div className="account-page">Загрузка...</div>;
	if (error) return <div className="account-page error">{error}</div>;
	if (!profile) return null;

	return (
		<div className="account-page">
			<div className="account-card">
				{profile.picture || user?.user_picture ? (
					<img src={profile.picture || user.user_picture} alt="avatar" className="account-avatar" referrerPolicy="no-referrer" />
				) : (
					<div className="account-avatar placeholder">👤</div>
				)}

				<h2 className="account-name">{profile.name || user.user_name}</h2>

				<p className="account-email">{profile.email || user.user_email}</p>

				<div className="account-meta">
					<span>Тип входа:</span>
					<b>{user.logged_as}</b>
				</div>

				{profile.role && (
					<div className="account-meta">
						<span>Роль:</span>
						<b>{profile.role}</b>
					</div>
				)}

				<button className="btn secondary logout-btn" onClick={handleLogout}>
					Выйти 🚪
				</button>
			</div>
		</div>
	);
};

export default Account;
