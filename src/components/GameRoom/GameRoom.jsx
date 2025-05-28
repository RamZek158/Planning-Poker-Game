import React from 'react';
import { useParams } from 'react-router';

const GameRoom = () => {
    let params = useParams();

    console.log('GameRoom params: ', params);


  return (
    <div>
      <h1>Игра с ID</h1>
      <p>Добро пожаловать</p>
    </div>
  );
};

GameRoom.displayName = 'GameRoom';
export default GameRoom;