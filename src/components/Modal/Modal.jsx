import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Modal.css";

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
				const userInfo = await axios.get(
					"https://www.googleapis.com/oauth2/v3/userinfo  ",
					{
						headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
					},
				);

				const { name, sub, email, picture } = userInfo.data;

				// Сохраняем в БД (предполагается, что функция addUser существует в проекте)
				// await addUser({ id: sub, name, email, picture, provider: "google" });

				// Сохраняем в cookie (убраны лишние пробелы)
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
			// Убраны пробелы в URL
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
			{/* Добавлен класс dark-theme для соответствия дизайну */}
			<div
				className='modal-content dark-theme'
				onClick={(e) => e.stopPropagation()}
			>
				<button className='modal-close' onClick={onClose}>
					×
				</button>

				<h2 className='modal-title'>
					{mode === "login" ? "Вход" : "Регистрация"}
				</h2>

				{error && <div className='modal-error'>{error}</div>}

				{/* Форма email/password */}
				<form onSubmit={handleSubmit} className='modal-form'>
					<div className='input-group'>
						<input
							type='email'
							placeholder='Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							required
							className='modal-input'
						/>
					</div>
					<div className='input-group'>
						<input
							type='password'
							placeholder='Пароль'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							required
							className='modal-input'
						/>
					</div>

					<button
						type='submit'
						className='btn primary modal-submit'
						disabled={loading}
					>
						{loading
							? "..."
							: mode === "login"
								? "Войти"
								: "Зарегистрироваться"}
					</button>
				</form>

				{/* Переключатель */}
				<p className='modal-switch'>
					{mode === "login" ? (
						<>
							Нет аккаунта?{" "}
							<button
								type='button'
								onClick={() => setMode("register")}
								className='link-button'
								disabled={loading}
							>
								Зарегистрируйтесь
							</button>
						</>
					) : (
						<>
							Уже есть аккаунт?{" "}
							<button
								type='button'
								onClick={() => setMode("login")}
								className='link-button'
								disabled={loading}
							>
								Войдите
							</button>
						</>
					)}
				</p>

				{/* Разделитель */}
				<div className='modal-divider'>или</div>

				{/* Google */}
				<button
					type='button'
					className='btn secondary google-btn'
					onClick={() => googleLogin()}
					disabled={loading}
				>
					<span className='google-icon'>G</span>
					Войти через Google
				</button>
			</div>
		</div>
	);
};

export default Modal;
