import React from "react";
import "./GameTable.css";
import { PlayingCard } from "../../components";

function GameTable({
	users = [],
	votes = {},
	showAllVotes,
	setShowAllVotes,
	allVoted,
	setVotes,
}) {
	return (
		<div className='game-table-container'>
			<div className='game-table'>
				{!showAllVotes ? (
					<>
						<p className='table-message'>Участники голосуют...</p>

						{allVoted && (
							<button
								className='btn primary show-cards-btn'
								onClick={() => setShowAllVotes(true)}
							>
								Показать карты
							</button>
						)}
					</>
				) : (
					<button
						className='btn primary restart-btn'
						onClick={() => {
							setVotes({});
							setShowAllVotes(false);
						}}
					>
						Начать новое голосование
					</button>
				)}
			</div>

			<div className='players-around'>
				{users.map((u) => {
					const voted = votes[u.id];

					return (
						<div key={u.id} className='player-slot'>
							{showAllVotes && voted ? (
								<div className='player-with-card'>
									<span className='player-name'>{u.name}</span>

									<PlayingCard
										cardSuitName={voted.suit}
										cardValue={voted.value}
									/>
								</div>
							) : (
								<div className={`user-rectangle ${voted ? "voted" : ""}`}>
									<span className='user-initial'>
										{u.name?.charAt(0)?.toUpperCase()}
									</span>
									<span className='user-name'>{u.name}</span>
									{voted && <div className='vote-indicator'>✓</div>}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default GameTable;
