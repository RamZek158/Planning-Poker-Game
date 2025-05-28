import React from 'react';
import { PlayingCard } from '../../components';
import { useParams } from 'react-router';

const GameRoom = () => {
    let params = useParams();

    console.log('GameRoom params: ', params);


  return (
    <section className="hero pageContainer">
         <div>
            <h1>Игра с ID</h1>
            <p>Добро пожаловать</p>
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