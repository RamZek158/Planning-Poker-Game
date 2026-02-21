import React, { useMemo } from "react";
import "./GameTable.css";
import { PlayingCard } from "../../components";

function GameTable({
	users = [],
	votes = {},
	showAllVotes,
	setShowAllVotes,
	setVotes,
	isAdmin,
	onShowVotes,
	onRestartGame,
}) {
	// Подсчет голосов
	const totalUsers = users.length;
	const votedCount = users.filter((u) => votes[u.id]).length;
	const allVoted = totalUsers > 0 && votedCount === totalUsers;
	const progressPercent = totalUsers > 0 ? (votedCount / totalUsers) * 100 : 0;

	// Подсчет среднего значения
	const averageScore = useMemo(() => {
		if (!showAllVotes) return null;
		let sum = 0;
		let count = 0;

		Object.values(votes).forEach((vote) => {
			let val = vote.value;
			if (val === "½" || val === "1/2") val = 0.5;
			const num = parseFloat(val);
			if (!isNaN(num)) {
				sum += num;
				count++;
			}
		});
		return count > 0 ? (sum / count).toFixed(1).replace(/\.0$/, "") : "—";
	}, [votes, showAllVotes]);

	return (
		<div className='poker-arena'>
			{/* Центральная консоль (Вместо овала) */}
			<div className='center-console'>
				{!showAllVotes ? (
					<div className='console-status fade-in'>
						<div className='status-header'>
							<span className='status-title'>
								{allVoted ? "Все голоса собраны" : "Сбор голосов..."}
							</span>
							<span className='status-count'>
								{votedCount} / {totalUsers}
							</span>
						</div>

						{/* Индикатор прогресса вместо горящей точки */}
						<div className='progress-bar-bg'>
							<div
								className='progress-bar-fill'
								style={{ width: `${progressPercent}%` }}
							></div>
						</div>

						<div className='console-actions'>
							{isAdmin ? (
								<button
									className={`btn primary reveal-btn ${allVoted ? "ready-pulse" : ""}`}
									onClick={onShowVotes} // <-- Используем пропс
									disabled={votedCount === 0}
								>
									Показать карты
								</button>
							) : (
								<p className='waiting-host-msg'>Ожидание организатора...</p>
							)}
						</div>
					</div>
				) : (
					<div className='console-results fade-in-up'>
						<span className='results-subtitle'>Средняя оценка</span>
						<div className='results-score-wrapper'>
							<span className='results-score'>{averageScore}</span>
						</div>

						{isAdmin ? (
							<button
								className='btn secondary restart-btn'
								onClick={onRestartGame} // <-- Используем пропс
							>
								<span className='icon'>↻</span> Новый раунд
							</button>
						) : (
							<p className='waiting-host-msg'>
								Организатор запускает новый раунд...
							</p>
						)}
					</div>
				)}
			</div>

			{/* Зона игроков */}
			<div className='players-container'>
				{users.map((u) => {
					const voted = votes[u.id];

					return (
						<div key={u.id} className='player-seat'>
							{showAllVotes && voted ? (
								<div className='player-card-reveal slide-up'>
									<PlayingCard
										cardSuitName={voted.suit}
										cardValue={voted.value}
									/>
									<span className='player-name-tag'>{u.name}</span>
								</div>
							) : (
								<div className='player-avatar-wrapper'>
									{/* Новая форма юзера: Сквиркл (закругленный квадрат) */}
									<div className={`user-squircle ${voted ? "voted" : ""}`}>
										<span className='user-initial'>
											{u.name?.charAt(0)?.toUpperCase()}
										</span>
										{voted && (
											<div className='vote-check-icon'>
												<svg
													viewBox='0 0 24 24'
													fill='none'
													stroke='currentColor'
													strokeWidth='3'
													strokeLinecap='round'
													strokeLinejoin='round'
												>
													<polyline points='20 6 9 17 4 12'></polyline>
												</svg>
											</div>
										)}
									</div>
									<span className='player-name-tag'>{u.name}</span>
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
