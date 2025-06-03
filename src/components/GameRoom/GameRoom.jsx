import React, { useCallback, useState, useEffect } from 'react';
import { PlayingCard } from '../../components';
import { useParams } from 'react-router';
import {useGameNameContext} from "../../providers/GameNameProvider";
import {saveGameSettings} from '../../api/gameSettings/gameSettings';

export const getGameSettings = () => {
  return fetch('/api/game-settings')
    .then((res) => res.json())
    .then((data) => data);
};

function GameRoom() {
  const [gameName, setGameName] = useState('Загрузка...');

  useEffect(() => {
    getGameSettings()
      .then(data => {
        if (data?.name) {
          setGameName(data.name);
        } else {
          setGameName('Без названия');
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setGameName('Ошибка');
      });
  }, []);

  return (
    <section className="hero pageContainer">
      <div>
        <h1>Игра: {gameName}</h1>
      </div>
      <div style={{display: 'flex', margin: '10px'}}>
            <div style={{margin: '10px', padding: '10px'}}>
                <PlayingCard randomCardSuit={0} cardValue="L" />
            </div>
            <div style={{margin: '10px', padding: '10px'}}>
                <PlayingCard randomCardSuit={1} cardValue="XL" />
            </div>
            <div style={{margin: '10px', padding: '10px'}}>
                <PlayingCard randomCardSuit={2} cardValue="XXL" />
            </div>
            <div style={{margin: '10px', padding: '10px'}}>
                <PlayingCard randomCardSuit={3} cardValue="?" />
            </div>
      </div>
    </section>
  );
};

GameRoom.displayName = 'GameRoom';
export default GameRoom;