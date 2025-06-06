import React, { useCallback, useState, useEffect } from "react";
import { PlayingCard } from "../../components";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import { getUsers } from "../../api/users/users";
import { getGameSettings } from "../../api/gameSettings/gameSettings";
import { FIBONACCI_VOTING_SYSTEM } from "../../utils";
import LoginUserModalWindow from "../LoginUserModalWindow/LoginUserModalWindow";



function GameRoom() {
	const [gameName, setGameName] = useState("");
	const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
	const [users, setUsers] = React.useState([]);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [gameId, setGameId] = React.useState("");

	const [cookies] = useCookies(["logged-user-info"]); // <-- используем те же куки, что в Header.jsx
	const user = cookies["logged-user-info"];
	const { id } = useParams(); // ID комнаты из URL

  // Проверяем авторизацию при загрузке страницы
  useEffect(() => {
    if (!cookies["logged-user-info"]) {
      setModalOpen(true); // если не авторизован — открываем модалку
    }
  }, [cookies]);

  const handleLogin = () => {
    setModalOpen(false); // закрываем модалку после входа
  };


	
	useEffect(() => {
		getGameSettings()
			.then((data) => {
				if (data) {
					setGameName(data?.name || "");
					setVotingType(data?.votingType || FIBONACCI_VOTING_SYSTEM);
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

	return (
		<section className="hero pageContainer">
			<div>
				<h1>Игра: {gameName}</h1>
			</div>
			<div style={{ display: "flex", margin: "10px" }}>
				<div style={{ margin: "10px", padding: "10px" }}>
					<PlayingCard randomCardSuit={0} cardValue="L" />
				</div>
				<div style={{ margin: "10px", padding: "10px" }}>
					<PlayingCard randomCardSuit={1} cardValue="XL" />
				</div>
				<div style={{ margin: "10px", padding: "10px" }}>
					<PlayingCard randomCardSuit={2} cardValue="XXL" />
				</div>
				<div style={{ margin: "10px", padding: "10px" }}>
					<PlayingCard randomCardSuit={3} cardValue="?" />
				</div>
			</div>
			{modalOpen && (<LoginUserModalWindow onLogin={handleLogin} onClose={() => setModalOpen(false)} isCloseButton={true} />)}
		</section>
	);
}

GameRoom.displayName = "GameRoom";
export default GameRoom;
