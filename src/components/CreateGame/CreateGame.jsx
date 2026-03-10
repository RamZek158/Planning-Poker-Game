import React from "react";
import "./CreateGame.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from "../../utils";
import { saveGameSettings } from "../../api/gameSettings/gameSettings";
import Modal from "../../components/Modal/Modal";

const CreateGame = () => {
	const [gameName, setGameName] = React.useState("");
	const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [gameId, setGameId] = React.useState("");

	const navigate = useNavigate();
	const [cookies] = useCookies(["logged-user-info"]);
	const user = cookies["logged-user-info"];

	// строки для отображения в select
	const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(", ");
	const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(", ");

	// смена типа голосования
	const handleVotingTypeChange = React.useCallback((event) => {
		const newVotingType = event.target.value.split(",");
		setVotingType(newVotingType);
	}, []);

	// смена названия игры
	const handleChangeGameName = React.useCallback((event) => {
		setGameName(event.target.value);
	}, []);

	// проверка авторизации
	const isUserRegistered = () => {
		return !!cookies["logged-user-info"];
	};

	// создание игры
	const handleCreateGame = React.useCallback(() => {
		if (!gameName.trim()) return;

		if (!isUserRegistered()) {
			setModalOpen(true);
		} else {
			setGameId(
				Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
			);
		}
	}, [gameName, cookies]);

	// после создания id — сохраняем настройки и переходим в комнату
	React.useEffect(() => {
		if (gameId && user) {
			saveGameSettings({
				id: gameId,
				userId: user.user_id,
				name: gameName,
				votingType,
			})
				.then(() => {
					navigate(`/game/${gameId}`);
				})
				.catch((e) => {
					console.error("SAVE GAME SETTINGS ERROR:", e);
				});
		}
	}, [gameId, user, gameName, votingType, navigate]);

	return (
		<section className='pageContainer middleAlignContainer'>
			<div className='createGameSection'>
				{/* Название игры */}
				<input
					type='text'
					onChange={handleChangeGameName}
					className='createGameItem'
					placeholder='Название игры'
					value={gameName}
				/>

				{/* Тип голосования */}
				<select className='createGameItem' onChange={handleVotingTypeChange}>
					<option value={FIBONACCI_VOTING_SYSTEM}>
						{`Modified Fibonacci (${fibonacci_system_string})`}
					</option>

					<option value={T_SHIRT_VOTING_SYSTEM}>
						{`T-shirts (${t_shirt_system_string})`}
					</option>
				</select>

				{/* Кнопка */}
				<button
					className='btn primary createGameItem'
					disabled={!gameName}
					onClick={handleCreateGame}
				>
					Начать игру 🎮
				</button>
			</div>

			{/* Модалка авторизации */}
			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</section>
	);
};

CreateGame.displayName = "CreateGame";
export default CreateGame;
