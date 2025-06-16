import React, { useState, useEffect, useRef } from "react";
import "./GameRoom.css";
import { PlayingCard, Carousel, GameTable } from "../../components";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import { getUsers } from "../../api/users/users";
import { getGameSettings } from "../../api/gameSettings/gameSettings";
import LoginUserModalWindow from "../LoginUserModalWindow/LoginUserModalWindow";

function GameRoom() {
	const [gameSettings, setGameSettings] = useState({});
	const [users, setUsers] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [votes, setVotes] = useState({});
	const [showAllVotes, setShowAllVotes] = useState(false);

	const [cookies] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];
	const { id } = useParams(); // ID комнаты из URL

	const gameOrganizer = gameSettings.userId === user.user_id;

	const [showNotVotedList, setShowNotVotedList] = useState(false);
	const dropdownRef = useRef(null);

	// Проверяем авторизацию при загрузке страницы
	useEffect(() => {
		if (!cookies["logged-user-info"]) {
			setModalOpen(true); // если не авторизован — открываем модалку
		}
	}, [cookies]);

	const handleLogin = () => {
		setModalOpen(false); // закрываем модалку после входа
	};

	// Загружаем данные игры и пользователей
	useEffect(() => {
		getGameSettings()
			.then((data) => {
				if (data) {
					setGameSettings(data || {});
				}
			})
			.catch((err) => {
				console.error("Ошибка загрузки:", err);
			});

		getUsers()
			.then((data) => {
				if (data) {
					setUsers(data);
				}
			})
			.catch((err) => {
				console.error("Ошибка загрузки:", err);
			});
	}, []);

	const copyLink = () => {
		const url = window.location.href;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				setShowToast(true);
				setTimeout(() => {
					setShowToast(false);
				}, 3000);
			})
			.catch((err) => {
				console.error("Ошибка при копировании ссылки:", err);
			});
	};

	const getSuitColor = (suit) => {
		return suit === "hearts" || suit === "diams" ? "red" : "black";
	};
	// Обработка выбора карты
	const handleCardClick = (value, suit) => {
		const userId = user?.user_id;
		if (!userId) return;

		setVotes((prev) => ({
			...prev,
			[userId]: { value, suit },
		}));
	};

	// Проверяем, все ли проголосовали
	const allVoted = users.every((u) => votes[u.id]);

	useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowNotVotedList(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

// Получаем список непроголосовавших
const notVotedUsers = users.filter((u) => !votes[u.id]);

	return (
		<div className="pageContent">
			{/* Кнопка "Пригласить участников" */}
			<div className="invite-button-container">
    <button onClick={copyLink} className="btn primary">
        Пригласить участников
    </button>
    <div className={`toast ${showToast ? "show" : ""}`}>🔗 Ссылка скопирована!</div>
</div>

			{/* Заголовок */}
			<h1 className="game-title">На обсуждении: {gameSettings.name}</h1>

			{/* Поле с голосами */}
<div className="game-room-layout">
    {/* Слева: выпадающий список */}
    <div className="sidebar">
        <div className="not-voted-dropdown" ref={dropdownRef}>
            <h3
                className="toggle-list"
                onClick={() => setShowNotVotedList((prev) => !prev)}
            >
                Ещё не проголосовали:
                {notVotedUsers.length > 0 && (
                    <span className="badge">{notVotedUsers.length}</span>
                )}
            </h3>

            {showNotVotedList && (
                <ul className="dropdown-list">
                    {notVotedUsers.map((u) => (
                        <li key={u.id} className="dropdown-item">
                            {u.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>

    {/* Центр: игровой стол */}
    <div className="main-content">
        <GameTable
            PlayingCard={PlayingCard}
            users={users}
            votes={votes}
            showAllVotes={showAllVotes}
            setShowAllVotes={setShowAllVotes}
            allVoted={allVoted}
            getSuitColor={getSuitColor}
            setVotes={setVotes}
        />
    </div>

    {/* Справа: результаты голосования (после "Показать карты") */}
<div className="right-sidebar">
    {showAllVotes && (
        <div className="votes-results">
            <h3>Результаты голосования</h3>
            <div className="votes-cards">
                {Object.entries(votes).map(([userId, vote]) => {
                    const user = users.find(u => u.id === userId);
                    return (
                        <div key={userId} className="vote-card">
                            <strong>{user?.name}</strong>
                            <PlayingCard
                                cardSuitName={vote.suit}
                                cardValue={vote.value}
                                cardColor={getSuitColor(vote.suit)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )}
</div>
</div>

			

			{/* Карусель снизу */}
			<div className="cards-containers">
				<Carousel items={gameSettings.votingType} onCardClick={handleCardClick} />
			</div>

			{/* Модальное окно */}
			{modalOpen && <LoginUserModalWindow onLogin={handleLogin} onClose={() => setModalOpen(false)} isCloseButton={true} />}
		</div>
	);
}

GameRoom.displayName = "GameRoom";
export default GameRoom;