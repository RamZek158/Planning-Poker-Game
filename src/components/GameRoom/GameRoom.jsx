import React, { useState, useEffect, useRef } from "react";
import "./GameRoom.css";

import { PlayingCard, Carousel, GameTable } from "../../components";
import Modal from "../../components/Modal/Modal";

import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router";

import {
	getGameSettings,
	deleteGameRoom,
} from "../../api/gameSettings/gameSettings";

function GameRoom() {
	const [gameSettings, setGameSettings] = useState({});
	const [users, setUsers] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [votes, setVotes] = useState({});
	const [showAllVotes, setShowAllVotes] = useState(false);

	const [cookies] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];

	const navigate = useNavigate();
	const { gameId } = useParams();

	const dropdownRef = useRef(null);

	console.log("ROOM PARAM ID:", gameId);
	console.log("ITEMS FOR CAROUSEL:", gameSettings?.voting_type);

	/* =========================================================
	   АВТОРИЗАЦИЯ
	========================================================= */

	useEffect(() => {
		if (!user) {
			setModalOpen(true);
			return;
		}

		setModalOpen(false);

		const userId = user?.user_id || user?.id;
		const userName = user?.user_name || user?.email;

		if (!userId) return;

		setUsers([
			{
				id: userId,
				name: userName,
			},
		]);
	}, [user]);

	/* =========================================================
	   ЗАГРУЗКА НАСТРОЕК КОМНАТЫ
	========================================================= */

	useEffect(() => {
		if (!gameId) return;

		getGameSettings(gameId)
			.then((data) => {
				console.log("GAME SETTINGS FROM DB:", data);

				if (!data) return;

				let voting = data.voting_type;

				// postgres array → js array
				if (typeof voting === "string") {
					voting = voting.replace(/[{}]/g, "").split(",");
				}

				console.log("VOTING TYPE PARSED:", voting);

				setGameSettings({
					...data,
					voting_type: voting,
				});
			})
			.catch(console.error);
	}, [gameId]);

	/* =========================================================
	   КОПИРОВАНИЕ ССЫЛКИ
	========================================================= */

	const copyLink = () => {
		const url = window.location.href;

		navigator.clipboard
			.writeText(url)
			.then(() => {
				setShowToast(true);
				setTimeout(() => setShowToast(false), 3000);
			})
			.catch(console.error);
	};

	/* =========================================================
	   ЛОГИКА КАРТ
	========================================================= */

	const getSuitColor = (suit) => {
		return suit === "hearts" || suit === "diams" ? "red" : "black";
	};

	const handleCardClick = (value) => {
		const userId = user?.user_id || user?.id;
		if (!userId) return;

		setVotes((prev) => ({
			...prev,
			[userId]: { value },
		}));
	};

	const allVoted = users.length > 0 ? users.every((u) => votes[u.id]) : false;

	/* =========================================================
	   УДАЛЕНИЕ КОМНАТЫ
	========================================================= */

	const handleDeleteRoom = async () => {
		console.log("DELETE CLICKED", gameId);

		const confirmDelete = window.confirm("Закрыть комнату?");
		if (!confirmDelete) return;

		try {
			const res = await deleteGameRoom(gameId);
			console.log("DELETE RESPONSE:", res);

			navigate("/");
		} catch (e) {
			console.error("DELETE ERROR:", e);
		}
	};

	/* =========================================================
	   RENDER
	========================================================= */

	return (
		<div className='pageContent'>
			{/* пригласить */}
			<div className='invite-button-container'>
				<button onClick={copyLink} className='btn primary'>
					Пригласить участников
				</button>

				<div className={`toast ${showToast ? "show" : ""}`}>
					🔗 Ссылка скопирована!
				</div>
			</div>

			{/* заголовок */}
			<h1 className='game-title'>
				На обсуждении: {gameSettings?.name || "Загрузка..."}
			</h1>

			<button className='btn danger' onClick={handleDeleteRoom}>
				Закрыть комнату 🗑
			</button>

			{/* игровой стол */}
			<div className='game-room-layout'>
				<div className='main-content'>
					<GameTable
						users={users}
						votes={votes}
						showAllVotes={showAllVotes}
						setShowAllVotes={setShowAllVotes}
						allVoted={allVoted}
						getSuitColor={getSuitColor}
						setVotes={setVotes}
					/>
				</div>
			</div>

			{/* карусель */}
			<div className='cards-containers'>
				<Carousel
					items={gameSettings?.voting_type || []}
					onCardClick={handleCardClick}
				/>
			</div>

			{/* модалка авторизации */}
			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	);
}

GameRoom.displayName = "GameRoom";
export default GameRoom;
