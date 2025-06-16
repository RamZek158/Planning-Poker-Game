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
        <button className="btn primary restart-btn" onClick={() => { setVotes({}); setShowAllVotes(false); }}>Начать новое голосование</button>
        </>
        )}
</div>

            {/* Участники вокруг стола */}
            <div className="players-around">
                {users.map((u) => {
                    const voted = votes[u.id];
                    return (
                        <div key={u.id} className="player-slot">
                            {voted ? (
                                <PlayingCard
                                    cardSuitName={voted.suit}
                                    cardValue={voted.value}
                                    cardColor={getSuitColor(voted.suit)}
                                />
                            ) : (
                                <div className="user-rectangle">
                                    {u.name.charAt(0).toUpperCase()}
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