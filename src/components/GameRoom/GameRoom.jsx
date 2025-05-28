import React from 'react';
import { useParams } from 'react-router-dom';

const GameRoom = () => {
  const { id } = useParams(); // Получаем gameId из URL

  // Здесь можно получить имя пользователя из localStorage
  const userName = localStorage.getItem('user_name');

  return (
    <div>
      <h1>Игра с ID: {id}</h1>
      <p>Добро пожаловать, {userName || 'Анонимный игрок'}!</p>
    </div>
  );
};

GameRoom.displayName = 'GameRoom';
export default GameRoom;