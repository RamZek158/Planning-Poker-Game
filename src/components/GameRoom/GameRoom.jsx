import React, { useCallback, useState, useEffect } from "react";
import { PlayingCard } from "../../components";
import { useParams } from "react-router";
import { getUsers } from "../../api/users/users";
import { getGameSettings } from "../../api/gameSettings/gameSettings";
import { FIBONACCI_VOTING_SYSTEM } from "../../utils";

function GameRoom() {
	const [gameName, setGameName] = useState("");
	const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
	const [users, setUsers] = React.useState([]);

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
		</section>
	);
}

GameRoom.displayName = "GameRoom";
export default GameRoom;
