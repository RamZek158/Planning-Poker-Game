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

	const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(", ");
	const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(", ");

	const handleVotingTypeChange = React.useCallback((event) => {
		const newVotingType = event.target.value.split(",");
		setVotingType(newVotingType);
	}, []);

	const handleChangeGameName = React.useCallback((event) => {
		setGameName(event.target.value);
	}, []);

	const isUserRegistered = () => {
		return !!cookies["logged-user-info"];
	};

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
		<section className="pageContainer middleAlignContainer createGamePage">
			<div className="createGameSection">
				<input
					type="text"
					onChange={handleChangeGameName}
					className="createGameItem"
					placeholder="Название игры"
					value={gameName}
				/>

				<select className="createGameItem" onChange={handleVotingTypeChange}>
					<option value={FIBONACCI_VOTING_SYSTEM}>
						{`Modified Fibonacci (${fibonacci_system_string})`}
					</option>

					<option value={T_SHIRT_VOTING_SYSTEM}>
						{`T-shirts (${t_shirt_system_string})`}
					</option>
				</select>

				<button
					className="btn primary createGameItem"
					disabled={!gameName}
					onClick={handleCreateGame}
				>
					Начать игру 🎮
				</button>
			</div>

			<Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</section>
	);
};

CreateGame.displayName = "CreateGame";
export default CreateGame;
