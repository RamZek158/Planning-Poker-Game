// src/components/Header/Modal.jsx
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Modal = ({ isOpen, onClose }) => {
	const [cookies, setCookie] = useCookies(["logged-user-info"]);
	const [mode, setMode] = useState("login"); // 'login' или 'register'
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Очистка ошибок при смене режима
	useEffect(() => {
		setError("");
	}, [mode]);

	// Google OAuth
	const googleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
				});

				const { name, sub, email, picture } = userInfo.data;

				// Сохраняем в БД
				await addUser({ id: sub, name, email, picture, provider: "google" });

				// Сохраняем в cookie
				setCookie(
					"logged-user-info",
					{
						logged_as: "google",
						logged_in: Date.now(),
						user_id: sub,
						user_name: name,
						user_email: email,
						user_picture: picture,
					},
					{ path: "/" },
				);

				onClose(); // закрываем модалку
			} catch (err) {
				console.error("Ошибка Google-логина:", err);
				setError("Не удалось войти через Google");
			}
		},
		onError: () => setError("Ошибка авторизации через Google"),
	});

	// Ручной вход / регистрация
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email || !password) return setError("Заполните все поля");

		setLoading(true);
		setError("");

		try {
			const url = mode === "login" ? "/api/login" : "/api/register";
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Ошибка сервера");
			}

			// Успешно: сохраняем JWT-токен и данные в cookie
			const token = data.token;
			const user = data.user;

			setCookie(
				"logged-user-info",
				{
					logged_as: "email",
					logged_in: Date.now(),
					user_id: user.id,
					user_email: user.email,
					user_name: user.email.split("@")[0], // простое имя
					jwt: token,
				},
				{ path: "/" },
			);

			onClose();
		} catch (err) {
			setError(err.message || "Неизвестная ошибка");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className='modal-overlay' onClick={onClose}>
			<div className='modal-content' onClick={(e) => e.stopPropagation()}>
				<button className='modal-close' onClick={onClose}>
					×
				</button>
				<h2>{mode === "login" ? "Вход" : "Регистрация"}</h2>

				{error && <div className='modal-error'>{error}</div>}

				{/* Форма email/password */}
				<form onSubmit={handleSubmit} className='modal-form'>
					<input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
					<input
						type='password'
						placeholder='Пароль'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={loading}
						required
					/>
					<button type='submit' className='btn primary' disabled={loading}>
						{loading ? "..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
					</button>
				</form>

				{/* Переключатель */}
				<p className='modal-switch'>
					{mode === "login" ? (
						<>
							Нет аккаунта?{" "}
							<button type='button' onClick={() => setMode("register")} className='link-button'>
								Зарегистрируйтесь
							</button>
						</>
					) : (
						<>
							Уже есть аккаунт?{" "}
							<button type='button' onClick={() => setMode("login")} className='link-button'>
								Войдите
							</button>
						</>
					)}
				</p>

				{/* Разделитель */}
				<div className='modal-divider'>или</div>

				{/* Google */}
				<button type='button' className='btn google-btn' onClick={() => googleLogin()} disabled={loading}>
					Войти через Google 🚀
				</button>
			</div>
		</div>
	);
};

export default Modal;
