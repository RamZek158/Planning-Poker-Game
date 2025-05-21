import React from 'react';
import './CreateGame.css';
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from '../../utils';

const CreateGame = () => {
  const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(', ') ;
  const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(', ') ;

  const handleChangeGameName = React.useCallback((event) => {
     console.log('change', event.target.value)
  }, []);

  return (
    <div className="create-game-container">
      <section>
        <div id="InputName">
          <input type="text" 
          onChange={handleChangeGameName}
                 id="InputName" 
                 placeholder="Название игры" 
          />
        </div>
        <select id="scale">
          <option>{`Modified Fibonacci (${fibonacci_system_string})`}</option>
          <option>{`T-shirts (${t_shirt_system_string})`}</option>
        </select>
          <div>
            <button className="NewGame" disabled>Начать игру</button>
          </div>
      </section>
    
    </div>
  );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;