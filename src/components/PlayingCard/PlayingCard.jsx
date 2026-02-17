import React from "react";
import "./PlayingCard.css";

const PlayingCard = ({ cardValue, isSelected }) => {
	return (
		<div className={`playingCard ${isSelected ? "selected" : ""}`}>
			{/* Декоративные элементы для фона (через CSS будут видны лучше) */}
			<div className='card-decoration top-left'></div>
			<div className='card-decoration bottom-right'></div>

			<p className='playingCardValue'>{cardValue}</p>
		</div>
	);
};

PlayingCard.displayName = "PlayingCard";
export default PlayingCard;
