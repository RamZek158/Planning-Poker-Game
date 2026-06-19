import React, { useState, useEffect } from "react";
import "./GameRoom.css";

import { Carousel, GameTable } from "../../components";
import Modal from "../../components/Modal/Modal";

import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { normalizeVotingType } from "../../utils";

import {
	getGameSettings,
	deleteGameRoom,
} from "../../api/gameSettings/gameSettings";

const socket = io(
	typeof window !== "undefined" ? window.location.origin : undefined,
	{
		path: "/socket.io",
	},
);

function GameRoom() {
	const [gameSettings, setGameSettings] = useState({});
	const [users, setUsers] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [deleteError, setDeleteError] = useState("");
	const [votes, setVotes] = useState({});
	const [showAllVotes, setShowAllVotes] = useState(false);

	const [cookies] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];
	const currentUserId = user?.user_id || user?.id;

	const navigate = useNavigate();
	const { gameId } = useParams();

	useEffect(() => {
		if (!user) {
			setModalOpen(true);
		} else {
			setModalOpen(false);
		}
	}, [user]);

	useEffect(() => {
		if (!gameId) return;

		getGameSettings(gameId)
			.then((data) => {
				if (!data) return;
				let voting = data.voting_type;
				if (typeof voting === "string") {
					voting = voting.replace(/[{}]/g, "").split(",");
				}
				setGameSettings({
					...data,
					voting_type: normalizeVotingType(voting),
				});
			})
			.catch(console.error);
	}, [gameId]);

	const isAdmin = gameSettings?.user_id === currentUserId;
	const canDeleteRoom = isAdmin;

	useEffect(() => {
		if (!gameId || !currentUserId) return;

		const currentUser = {
			id: currentUserId,
			name: user?.user_name || user?.user_email,
		};

		socket.emit("join_room", {
			roomId: gameId,
			user: currentUser,
			token: user?.jwt,
		});

		socket.on("room_state", (state) => {
			setUsers(state.users);
			setVotes(state.votes);
			setShowAllVotes(state.showAllVotes);
		});

		socket.on("users_update", (updatedUsers) => {
			setUsers(updatedUsers);
		});

		socket.on("votes_update", (updatedVotes) => {
			setVotes(updatedVotes);
		});

		socket.on("cards_revealed", () => {
			setShowAllVotes(true);
		});

		socket.on("game_restarted", () => {
			setVotes({});
			setShowAllVotes(false);
		});

		return () => {
			socket.off("room_state");
			socket.off("users_update");
			socket.off("votes_update");
			socket.off("cards_revealed");
			socket.off("game_restarted");
		};
	}, [gameId, currentUserId, user]);

	const handleCardClick = (value) => {
		if (!currentUserId || showAllVotes) return;
		socket.emit("vote", { roomId: gameId, userId: currentUserId, value });
	};

	const handleShowVotes = () => {
		if (isAdmin) {
			socket.emit("show_cards", { roomId: gameId });
		}
	};

	const handleRestartGame = () => {
		if (isAdmin) {
			socket.emit("restart_game", { roomId: gameId });
		}
	};

	const copyLink = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			setDeleteError("");
			setShowToast(true);
			setTimeout(() => setShowToast(false), 3000);
		});
	};

	const handleDeleteRoom = async () => {
		try {
			setDeleteError("");
			await deleteGameRoom(gameId, {
				token: user?.jwt,
				userId: currentUserId,
			});
			setConfirmCloseOpen(false);
			navigate("/");
		} catch (e) {
			console.error("DELETE ERROR:", e);
			setDeleteError(e.message || "Не удалось закрыть комнату");
		}
	};

	return (
		<div className='game-room-page'>
			<header className='room-top-bar'>
				<div className='room-info'>
					<h1 className='room-name'>{gameSettings?.name || "Загрузка..."}</h1>
					<span className='room-badge'>На обсуждение...</span>
				</div>

				<div className='room-controls'>
					<button onClick={copyLink} className='room-control-btn share-btn'>
						<span className='icon'>🔗</span> Копировать ссылку
					</button>
					{canDeleteRoom && (
						<button
							onClick={() => {
								setDeleteError("");
								setConfirmCloseOpen(true);
							}}
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
			<div className={`toast toast-error ${deleteError ? "show" : ""}`}>
				{deleteError}
			</div>

			<main className='room-main-content'>
				<GameTable
					users={users}
					votes={votes}
					showAllVotes={showAllVotes}
					isAdmin={isAdmin}
					onShowVotes={handleShowVotes}
					onRestartGame={handleRestartGame}
				/>
			</main>

			<div className='cards-containers'>
				<Carousel
					items={gameSettings?.voting_type || []}
					onCardClick={handleCardClick}
				/>
			</div>

			{confirmCloseOpen && (
				<div
					className='room-dialog-backdrop'
					onClick={() => setConfirmCloseOpen(false)}
				>
					<div className='room-dialog' onClick={(e) => e.stopPropagation()}>
						<div className='room-dialog-eyebrow'>Закрытие комнаты</div>
						<h2 className='room-dialog-title'>Закрыть эту сессию?</h2>
						<p className='room-dialog-text'>
							Комната будет скрыта, а участники больше не смогут зайти по этой
							ссылке.
						</p>
						<div className='room-dialog-actions'>
							<button
								type='button'
								className='room-dialog-btn room-dialog-btn-secondary'
								onClick={() => setConfirmCloseOpen(false)}
							>
								Оставить открытой
							</button>
							<button
								type='button'
								className='room-dialog-btn room-dialog-btn-danger'
								onClick={handleDeleteRoom}
							>
								Закрыть комнату
							</button>
						</div>
					</div>
				</div>
			)}

			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</div>
	);
}

export default GameRoom;
