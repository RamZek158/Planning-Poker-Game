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

	// Исправлен ключ куки (убран лишний пробел)
	const user = cookies["logged-user-info"];

	// ⛔ если нет куки — сразу на главную
	useEffect(() => {
		if (!user) navigate("/");
	}, [user, navigate]);

	// 🔐 загрузка профиля через JWT
	useEffect(() => {
		const fetchProfile = async () => {
			if (!user?.jwt) {
				// Google-пользователь (без JWT) или моковые данные для демонстрации
				setProfile({
					...user,
					// Добавляем заглушки, если бекенд не отдает эти поля сразу
					phone: user.phone || "+7 (___) ___-__-__",
					registered_at: user.registered_at || new Date().toISOString(),
					last_login: user.last_login || new Date().toISOString(),
					stats: user.stats || { orders: 0, visits: 1, points: 0 },
				});
				setLoading(false);
				return;
			}

			try {
				const res = await axios.get("/api/me", {
					headers: {
						Authorization: `Bearer ${user.jwt}`,
					},
				});
				// Мерджим данные бекенда с дефолтными, чтобы верстка не ломалась
				setProfile({
					...res.data,
					stats: res.data.stats || { orders: 0, visits: 1, points: 0 },
				});
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

	// Форматирование даты
	const formatDate = (dateString) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	if (loading)
		return (
			<div className='account-page'>
				<div className='loader'>Загрузка профиля...</div>
			</div>
		);
	if (error)
		return (
			<div className='account-page'>
				<div className='error-message'>{error}</div>
			</div>
		);
	if (!profile) return null;

	// Расчет заполнения профиля (для прогресс-бара)
	const profileCompletion = 65; // Заглушка, можно считать динамически

	return (
		<div className='account-page'>
			<div className='account-container'>
				{/* Левая колонка - Основное */}
				<div className='account-main'>
					<div className='account-card profile-header'>
						<div className='profile-top'>
							{profile.picture || user?.user_picture ? (
								<img
									src={profile.picture || user.user_picture}
									alt='avatar'
									className='account-avatar'
									referrerPolicy='no-referrer'
								/>
							) : (
								<div className='account-avatar placeholder'>👤</div>
							)}
							<div className='profile-info'>
								<h2 className='account-name'>
									{profile.name || user.user_name}
								</h2>
								<p className='account-email'>
									{profile.email || user.user_email}
								</p>
								<span className='account-badge'>
									{user.logged_as || "Пользователь"}
								</span>
							</div>
						</div>

						<div className='profile-progress'>
							<div className='progress-label'>
								<span>Заполненность профиля</span>
								<span>{profileCompletion}%</span>
							</div>
							<div className='progress-bar'>
								<div
									className='progress-fill'
									style={{ width: `${profileCompletion}%` }}
								></div>
							</div>
						</div>
					</div>

					{/* Секция: Информация */}
					<div className='account-card info-section'>
						<h3 className='section-title'>📋 Основная информация</h3>
						<div className='info-grid'>
							<div className='info-item'>
								<span className='info-label'>Телефон</span>
								<span className='info-value'>
									{profile.phone || "Не указан"}
								</span>
							</div>
							<div className='info-item'>
								<span className='info-label'>Роль</span>
								<span className='info-value'>
									{profile.role || "Пользователь"}
								</span>
							</div>
							<div className='info-item'>
								<span className='info-label'>Дата регистрации</span>
								<span className='info-value'>
									{formatDate(profile.registered_at)}
								</span>
							</div>
							<div className='info-item'>
								<span className='info-label'>Последний вход</span>
								<span className='info-value'>
									{formatDate(profile.last_login)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Правая колонка - Сайдбар */}
				<div className='account-sidebar'>
					{/* Секция: Статистика */}
					<div className='account-card stats-section'>
						<h3 className='section-title'>📊 Активность</h3>
						<div className='stats-grid'>
							<div className='stat-item'>
								<span className='stat-value'>{profile.stats?.orders || 0}</span>
								<span className='stat-label'>Заказов</span>
							</div>
							<div className='stat-item'>
								<span className='stat-value'>{profile.stats?.visits || 1}</span>
								<span className='stat-label'>Визитов</span>
							</div>
							<div className='stat-item'>
								<span className='stat-value'>{profile.stats?.points || 0}</span>
								<span className='stat-label'>Баллов</span>
							</div>
						</div>
					</div>

					{/* Секция: Действия */}
					<div className='account-card actions-section'>
						<h3 className='section-title'>⚙️ Управление</h3>
						<div className='actions-list'>
							<button className='action-btn'>
								<span className='btn-icon'>✏️</span>
								Редактировать
							</button>
							<button className='action-btn'>
								<span className='btn-icon'>🔒</span>
								Сменить пароль
							</button>
							<button className='action-btn'>
								<span className='btn-icon'>🔔</span>
								Уведомления
							</button>
							<hr className='action-divider' />
							<button
								className='btn secondary logout-btn'
								onClick={handleLogout}
							>
								Выйти 🚪
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Account;
