import React from "react";
import "./CreateGame.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from "../../utils";
import { saveGameSettings } from "../../api/gameSettings/gameSettings";
import LoginUserModalWindow from "../LoginUserModalWindow/LoginUserModalWindow";

const CreateGame = () => {
	const [gameName, setGameName] = React.useState("");
	const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [gameId, setGameId] = React.useState("");

	const navigate = useNavigate();
	const [cookies] = useCookies(["logged-user-info"]); // <-- используем те же куки, что в Header.jsx
	const user = cookies["logged-user-info"];

	const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(", ");
	const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(", ");

	const handleVotingTypeChange = React.useCallback((event) => {
		const newVotingType = event.target.value.split(",");
		setVotingType(newVotingType);
	}, []);

	const handleChangeGameName = React.useCallback((event) => {
		setGameName(event.target.value);
	}, []);

	// Проверяем, есть ли пользователь в куках
	const isUserRegistered = () => {
		return !!cookies["logged-user-info"];
	};

	const handleCreateGame = React.useCallback(() => {
		if (!gameName.trim()) return;

		if (!isUserRegistered()) {
			console.log("setModalOpen");
			setModalOpen(true);
		} else {
			setGameId(Math.random().toString(36).substring(2, 10) + Date.now().toString(36));
		}
	}, [gameName, setModalOpen, setGameId]);

	const handleLoginCustomUser = React.useCallback(() => {
		setModalOpen(false);
		setGameId(Math.random().toString(36).substring(2, 10) + Date.now().toString(36));
	}, [setModalOpen, setGameId]);

	const handleCloseModalWindow = React.useCallback(() => {
		setModalOpen(false);
	}, [setModalOpen, setGameId]);



	React.useEffect(() => {
		if (gameId && user) {
			saveGameSettings({
				id: gameId,
				userId: user.user_id,
				name: gameName,
				votingType,
			});
			navigate(`/game/${gameId}`);
		}
	}, [gameId, user]);

	return (
		<section className="pageContainer middleAlignContainer">
			<div className="createGameSection">
				<div>
					<input type="text" onChange={handleChangeGameName} className="createGameItem" placeholder="Название игры" value={gameName} />
				</div>
				<select className="createGameItem" onChange={handleVotingTypeChange}>
					<option value={FIBONACCI_VOTING_SYSTEM}>{`Modified Fibonacci (${fibonacci_system_string})`}</option>
					<option value={T_SHIRT_VOTING_SYSTEM}>{`T-shirts (${t_shirt_system_string})`}</option>
				</select>
				<div>
					<button className="btn primary createGameItem" disabled={!gameName} onClick={handleCreateGame}>
						Начать игру 🎮
					</button>
				</div>
			</div>

			{/* Модальное окно */}
			{modalOpen && (<LoginUserModalWindow onLogin={handleLoginCustomUser} onClose={handleCloseModalWindow} />)}
		</section>
	);
};

CreateGame.displayName = "CreateGame";
export default CreateGame;
