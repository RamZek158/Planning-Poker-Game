import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import logo from "../../assets/images/logo.png";
import { useCookies } from "react-cookie";
// УДАЛЕНО: googleLogout, useGoogleLogin — перенесено в Modal.jsx
import { deleteUser } from "../../api/users/users"; // addUser теперь используется только в Modal
import Modal from "./Modal"; // ← новый импорт

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false); // ← новое состояние
	const [cookies, , removeCookie] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];
	const navigate = useNavigate();

	const handleCreateNewGame = useCallback(() => {
		navigate("/create-game");
	}, [navigate]);

	// УДАЛЕНО: handleAddUser — не используется здесь

	const handleLogout = useCallback(() => {
		// Удаляем только куки — никаких запросов к БД!
		removeCookie("logged-user-info", { path: "/" });
		setMenuOpen(false);
		// Опционально: перенаправить на главную
		navigate("/");
	}, [removeCookie, navigate]);

	const handleMenuOpen = () => {
		setMenuOpen((prev) => !prev);
	};

	return (
		<>
			<header className="header">
				<div className="left-section">
					<Link to="/" className="left-section">
						<img src={logo} alt="Логотип" className="logo-image" />
					</Link>
					<p className="whiteTextLink">Planning Poker Game</p>
				</div>

				<div className="right-section">
					<div className="auth-buttons">
						<button className="btn secondary" onClick={handleCreateNewGame}>
							Создать новую игру ✎
						</button>
						<div className="profile-wrapper">
							{!user ? (
								// Кнопка открывает модальное окно вместо прямого Google-логина
								<button className="btn primary" onClick={() => setIsModalOpen(true)}>
									Войти / Зарегистрироваться
								</button>
							) : (
								<>
									<button className="btn secondary profile" onClick={handleMenuOpen}>
										<img src={user.user_picture} referrerPolicy="no-referrer" className="user-image" alt="avatar" />
										<span className={`arrow ${menuOpen ? "open" : ""}`}>❯</span>
										<span>{user.user_name}</span>
									</button>
									{menuOpen && (
										<div className="menuItem">
											<button className="btn secondary menuItemButton" onClick={handleLogout}>
												Выйти 🚪
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</header>

			{/* Модальное окно — рендерится вне header */}
			{isModalOpen && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
		</>
	);
};

Header.displayName = "Header";
export default Header;
