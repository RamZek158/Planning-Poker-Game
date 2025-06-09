import React from "react";
import "./PlayingCard.css";

const CARD_SUIT_MAP = {
	hearts: 0,
	diams: 1,
	spades: 2,
	clubs: 3,
};
const PlayingCard = ({ cardSuitName, randomCardSuit, cardValue }) => {
	const cardSuits = ["♡", "♢", "♤", "♧"];

	let cardSuit;
	let cardSuitClass = "card_";
	if (cardSuitName) {
		cardSuit = cardSuits[CARD_SUIT_MAP[cardSuitName]];
		cardSuitClass += cardSuitName;
	} else {
		cardSuit = cardSuits[randomCardSuit] || cardSuits[0];
		if (Object.keys(CARD_SUIT_MAP)[randomCardSuit]) {
			cardSuitClass += Object.keys(CARD_SUIT_MAP)[randomCardSuit];
		} else {
			cardSuitClass += Object.keys(CARD_SUIT_MAP)[0];
		}
	}

	return (
		<div className="playingCard">
			<div className="cardSuitsContainer">
				<p className={`top-left card-suit ${cardSuitClass}`}>{cardSuit}</p>
				<p className={`bottom-left card-suit ${cardSuitClass}`}>{cardSuit}</p>
			</div>
			{cardValue && <p className={`playingCardValue ${cardSuitClass}`}>{cardValue}</p>}
			{!cardValue && <p className={`playingCardValue ${cardSuitClass}`}>{cardSuit}</p>}
			<div className="cardSuitsContainer">
				<p className={`top-right card-suit ${cardSuitClass}`}>{cardSuit}</p>
				<p className={`bottom-right card-suit ${cardSuitClass}`}>{cardSuit}</p>
			</div>
		</div>
	);
};

PlayingCard.displayName = "PlayingCard";
export default PlayingCard;
