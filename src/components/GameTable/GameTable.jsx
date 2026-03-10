import React, { useMemo } from "react";
import "./GameTable.css";
import { PlayingCard } from "../../components";
import {
	T_SHIRT_VOTING_SYSTEM,
	FIBONACCI_VOTING_SYSTEM,
} from "../../utils";

const SPECIAL_VOTES = new Set(["?", "☕"]);

const NUMERIC_SCALE = FIBONACCI_VOTING_SYSTEM.filter(
	(value) => !SPECIAL_VOTES.has(value),
);
const T_SHIRT_SCALE = T_SHIRT_VOTING_SYSTEM.filter(
	(value) => !SPECIAL_VOTES.has(value),
);

const normalizeVote = (value) => {
	if (value === "ВЅ" || value === "½" || value === "1/2") return "½";
	return value;
};

const getMostFrequentVote = (values) => {
	const counts = new Map();

	values.forEach((value) => {
		counts.set(value, (counts.get(value) || 0) + 1);
	});

	return (
		[...counts.entries()].sort((a, b) => {
			if (b[1] !== a[1]) return b[1] - a[1];
			return values.lastIndexOf(b[0]) - values.lastIndexOf(a[0]);
		})[0]?.[0] || "—"
	);
};

const getScaleResult = (values, scale) => {
	const indexes = values
		.map((value) => scale.indexOf(value))
		.filter((index) => index >= 0);

	if (!indexes.length) return null;

	const averageIndex =
		indexes.reduce((sum, index) => sum + index, 0) / indexes.length;
	return scale[Math.round(averageIndex)] || null;
};

function GameTable({
	users = [],
	votes = {},
	showAllVotes,
	isAdmin,
	onShowVotes,
	onRestartGame,
}) {
	const totalUsers = users.length;
	const votedCount = users.filter((u) => votes[u.id]).length;
	const allVoted = totalUsers > 0 && votedCount === totalUsers;
	const progressPercent = totalUsers > 0 ? (votedCount / totalUsers) * 100 : 0;

	const finalScore = useMemo(() => {
		if (!showAllVotes) return null;

		const normalizedVotes = Object.values(votes)
			.map((vote) => normalizeVote(vote.value))
			.filter(Boolean);

		if (!normalizedVotes.length) return "—";

		const nonSpecialVotes = normalizedVotes.filter(
			(value) => !SPECIAL_VOTES.has(value),
		);

		if (!nonSpecialVotes.length) {
			return getMostFrequentVote(normalizedVotes);
		}

		const allNumeric = nonSpecialVotes.every((value) =>
			NUMERIC_SCALE.includes(value),
		);

		if (allNumeric) {
			let sum = 0;
			let count = 0;

			nonSpecialVotes.forEach((value) => {
				const numericValue = value === "½" ? 0.5 : parseFloat(value);
				if (!Number.isNaN(numericValue)) {
					sum += numericValue;
					count += 1;
				}
			});

			if (!count) return getMostFrequentVote(normalizedVotes);
			return (sum / count).toFixed(1).replace(/\.0$/, "");
		}

		const allTShirt = nonSpecialVotes.every((value) =>
			T_SHIRT_SCALE.includes(value),
		);

		if (allTShirt) {
			return getScaleResult(nonSpecialVotes, T_SHIRT_SCALE) || "—";
		}

		return getMostFrequentVote(normalizedVotes);
	}, [votes, showAllVotes]);

	return (
		<div className='poker-arena'>
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
									onClick={onShowVotes}
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
						<span className='results-subtitle'>Итоговая оценка</span>
						<div className='results-score-wrapper'>
							<span className='results-score'>{finalScore}</span>
						</div>

						{isAdmin ? (
							<button className='btn secondary restart-btn' onClick={onRestartGame}>
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

			<div className='players-container'>
				{users.map((u) => {
					const voted = votes[u.id];

					return (
						<div key={u.id} className='player-seat'>
							{showAllVotes && voted ? (
								<div className='player-card-reveal slide-up'>
									<PlayingCard
										cardSuitName={voted.suit}
										cardValue={normalizeVote(voted.value)}
									/>
									<span className='player-name-tag'>{u.name}</span>
								</div>
							) : (
								<div className='player-avatar-wrapper'>
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
