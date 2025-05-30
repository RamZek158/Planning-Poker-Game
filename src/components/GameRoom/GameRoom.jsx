import React from 'react';
import { PlayingCard } from '../../components';
import { useParams } from 'react-router';
import {useGameNameContext} from "../../providers/GameNameProvider";

const GameRoom = () => {
    const params = useParams();
    const { gameName } = useGameNameContext();

    console.log('GameRoom params: ', params);
    console.log('GameRoom gameName: ', gameName);


  return (
    <section className="hero pageContainer">
         <div>
            <h1>{gameName}</h1>
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