import React, { useState } from 'react';
import './CreateGame.css'; // Стили для траницы
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from '../../utils'
const CreateGame = () => {

  
  console.log('fibonacci_system ',  T_SHIRT_VOTING_SYSTEM);
  return (
    <div className="create-game-container">
      <section>
        <div id="InputName">
          <input type="text" 
                 id="InputName" 
                 placeholder="Название игры" 
          />
        </div>
        <select id="scale">
          <option>`Modified Fibonacci (${T_SHIRT_VOTING_SYSTEM}.join(', '))`</option>   
          <option>T-shirts (XS, S, M, L, XL, XXL, ?, ☕)</option>
        </select>
          <div>
            <button className="NewGame">Начать игру</button>
          </div>
      </section>
    
    </div>
  );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;