import React from "react";
import "./GameTable.css";
import { PlayingCard, Carousel, } from "../../components";

function GameTable({ users, votes, showAllVotes, setShowAllVotes, allVoted, PlayingCard, getSuitColor, setVotes }) {
    return (
        <div className="game-table-container">
            {/* Игровой стол */}
            <div className="game-table">
                {!showAllVotes ? (
                    <>
                        <p className="table-message">Голосуют участники...</p>
                        {allVoted && (
                            <button className="btn primary show-cards-btn" onClick={() => setShowAllVotes(true)}>
                                Показать карты
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Кнопка "Начать новое голосование" */}
                        <button className="btn primary restart-btn" onClick={() => { setVotes({}); setShowAllVotes(false); }}>
                            Начать новое голосование
                        </button>
                    </>
                )}
            </div>

            {/* Участники вокруг стола */}
            <div className="players-around">
                {users.map((u) => {
                    const voted = votes[u.id];
                    return (
                        <div key={u.id} className="player-slot">
                            {/* Показываем карту только после нажатия "Показать карты" */}
                            {showAllVotes && voted ? (
                                <div className="player-with-card">
                                    <span className="player-name">{u.name}</span>
                                </div>
                            ) : (
                                <div className={`user-rectangle ${voted ? 'voted' : ''}`}>
                                    <span className="user-initial">{u.name.charAt(0).toUpperCase()}</span>
                                    <span className="user-name">{u.name}</span>
                                    {voted && <div className="vote-indicator">✓</div>}
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