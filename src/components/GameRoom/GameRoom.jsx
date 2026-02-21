import React, { useState, useEffect } from "react";
import "./GameRoom.css";

import { PlayingCard, Carousel, GameTable } from "../../components";
import Modal from "../../components/Modal/Modal";

import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router";

// Импортируем Socket.IO
import io from "socket.io-client";

import {
	getGameSettings,
	deleteGameRoom,
} from "../../api/gameSettings/gameSettings";

// Подключаемся к бэкенду (Укажи свой порт, если он отличается)
const socket = io("http://localhost:3001");

function GameRoom() {
	const [gameSettings, setGameSettings] = useState({});
	const [users, setUsers] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [votes, setVotes] = useState({});
	const [showAllVotes, setShowAllVotes] = useState(false);

	const [cookies] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];
	const currentUserId = user?.user_id || user?.id;

	const navigate = useNavigate();
	const { gameId } = useParams();

	// 1. Проверка авторизации
	useEffect(() => {
		if (!user) {
			setModalOpen(true);
		} else {
			setModalOpen(false);
		}
	}, [user]);

	// 2. Получение настроек комнаты
	useEffect(() => {
		if (!gameId) return;

		getGameSettings(gameId)
			.then((data) => {
				if (!data) return;
				let voting = data.voting_type;
				if (typeof voting === "string") {
					voting = voting.replace(/[{}]/g, "").split(",");
				}
				setGameSettings({ ...data, voting_type: voting });
			})
			.catch(console.error);
	}, [gameId]);

	// === ЛОГИКА АДМИНА ===
	// Теперь мы точно знаем, что gameSettings.user_id — это ID создателя из БД!
	const isAdmin = gameSettings?.user_id === currentUserId;

	// 3. Подключение к WebSockets
	useEffect(() => {
		if (!gameId || !currentUserId) return;

		const currentUser = {
			id: currentUserId,
			name: user?.user_name || user?.email,
		};

		// Входим в комнату
		socket.emit("join_room", { roomId: gameId, user: currentUser });

		// Слушаем текущее состояние (при первом входе)
		socket.on("room_state", (state) => {
			setUsers(state.users);
			setVotes(state.votes);
			setShowAllVotes(state.showAllVotes);
		});

		// Слушаем обновление списка игроков (кто-то зашел/вышел)
		socket.on("users_update", (updatedUsers) => {
			setUsers(updatedUsers);
		});

		// Слушаем новые голоса
		socket.on("votes_update", (updatedVotes) => {
			setVotes(updatedVotes);
		});

		// Слушаем вскрытие карт
		socket.on("cards_revealed", () => {
			setShowAllVotes(true);
		});

		// Слушаем перезапуск игры
		socket.on("game_restarted", () => {
			setVotes({});
			setShowAllVotes(false);
		});

		// Очистка при выходе из комнаты
		return () => {
			socket.off("room_state");
			socket.off("users_update");
			socket.off("votes_update");
			socket.off("cards_revealed");
			socket.off("game_restarted");
		};
	}, [gameId, currentUserId, user]);

	/* =========================================================
	   ЭКШЕНЫ (Отправляем на сервер)
	========================================================= */

	// Клик по карте карусели
	const handleCardClick = (value) => {
		if (!currentUserId || showAllVotes) return;
		// Локально обновлять не обязательно, но можно для мгновенного отклика
		// Основная логика — отправить на сервер:
		socket.emit("vote", { roomId: gameId, userId: currentUserId, value });
	};

	// Админ нажимает "Показать карты"
	const handleShowVotes = () => {
		if (isAdmin) {
			socket.emit("show_cards", { roomId: gameId });
		}
	};

	// Админ нажимает "Новый раунд"
	const handleRestartGame = () => {
		if (isAdmin) {
			socket.emit("restart_game", { roomId: gameId });
		}
	};

	const copyLink = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		});
	};

	const handleDeleteRoom = async () => {
		const confirmDelete = window.confirm(
			"Вы уверены, что хотите закрыть комнату?",
		);
		if (!confirmDelete) return;
		try {
			await deleteGameRoom(gameId);
			navigate("/");
		} catch (e) {
			console.error("DELETE ERROR:", e);
		}
	};

	return (
		<div className='game-room-page'>
			<header className='room-top-bar'>
				<div className='room-info'>
					<h1 className='room-name'>{gameSettings?.name || "Загрузка..."}</h1>
					<span className='room-badge'>Planning Poker</span>
				</div>

				<div className='room-controls'>
					<button onClick={copyLink} className='room-control-btn share-btn'>
						<span className='icon'>🔗</span> Копировать ссылку
					</button>
					{isAdmin && (
						<button
							onClick={handleDeleteRoom}
							className='room-control-btn close-btn'
						>
							<span className='icon'>✕</span> Закрыть комнату
						</button>
					)}
				</div>
			</header>

			<div className={`toast ${showToast ? "show" : ""}`}>
				Ссылка скопирована!
			</div>

			<main className='room-main-content'>
				<GameTable
					users={users}
					votes={votes}
					showAllVotes={showAllVotes}
					isAdmin={isAdmin}
					onShowVotes={handleShowVotes} // Передаем функцию
					onRestartGame={handleRestartGame} // Передаем функцию
				/>
			</main>

			<div className='cards-containers'>
				<Carousel
					items={gameSettings?.voting_type || []}
					onCardClick={handleCardClick}
				/>
			</div>

			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	);
}

export default GameRoom;
