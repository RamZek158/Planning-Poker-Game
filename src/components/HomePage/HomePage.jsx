import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
	const navigate = useNavigate();

	const goToCreateGame = () => {
		navigate("/create-game");
	};

	return (
		<div className="container">
			<section className="hero">
				<h1 className="hero-title">
					Оцените задачи вместе с командой — быстро, удобно, удалённо
				</h1>
				<p className="hero-subtitle">
					Онлайн Planning Poker для Agile-команд. Точная оценка, минимальные
					задержки.
				</p>
			</section>

			<section className="features">
				<h2 className="section-title">Почему выбирают нас?</h2>
				<div className="feature-grid">
					<div className="feature-card">
						<h3>Реальное время</h3>
						<p>Оценивайте задачи онлайн вместе с командой.</p>
					</div>
					<div className="feature-card">
						<h3>Визуальные результаты</h3>
						<p>Мгновенные графики после голосования.</p>
					</div>
					<div className="feature-card">
						<h3>Адаптивность</h3>
						<p>Используйте с любого устройства — десктоп, планшет, телефон.</p>
					</div>
					<div className="feature-card">
						<h3>Интеграции</h3>
						<p>Совместимость с Jira, GitHub, Linear и другими системами.</p>
					</div>
				</div>
			</section>

			<section className="how-it-works">
				<h2 className="section-title">Как это работает?</h2>
				<div className="steps">
					<div className="step">
						<span className="step-number">1</span>
						<h3>Создайте комнату</h3>
						<p>Выберите параметры игры и пригласите команду.</p>
					</div>
					<div className="step">
						<span className="step-number">2</span>
						<h3>Добавьте задачи</h3>
						<p>Импортируйте их или введите вручную.</p>
					</div>
					<div className="step">
						<span className="step-number">3</span>
						<h3>Начните голосование</h3>
						<p>Получите точные оценки за считанные минуты.</p>
					</div>
				</div>
			</section>

			<section className="final-cta">
				<h2 className="cta-title">Готовы начать?</h2>
				<p className="cta-text">
					Создайте свою первую сессию планирования бесплатно!
				</p>
				<button onClick={goToCreateGame} className="btn primary">
					Начать сейчас
				</button>
			</section>
		</div>
	);
};

HomePage.displayName = "HomePage";
export default HomePage;
