import React from 'react';
import './CreateGame.css';
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from '../../utils';

const CreateGame = () => {
  const [gameName, setGameName] = React.useState('');
  const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
  const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(', ') ;
  const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(', ') ;

  const handleVotingTypeChange = React.useCallback((event) => {
    setVotingType(event.target.value);
  }, [setVotingType]);

  const handleChangeGameName = React.useCallback((event) => {
    setGameName(event.target.value);
  }, [setGameName]);

  return (
    <section className="pageContainer middleAlignContainer">
      <div className="createGameSection">
        <div>
          <input type="text" 
          onChange={handleChangeGameName}
                 className="createGameItem"
                 placeholder="Название игры" 
          />
        </div>
        <select className="createGameItem" onChange={handleVotingTypeChange}>
          <option value={FIBONACCI_VOTING_SYSTEM}>{`Modified Fibonacci (${fibonacci_system_string})`}</option>
          <option value={T_SHIRT_VOTING_SYSTEM}>{`T-shirts (${t_shirt_system_string})`}</option>
        </select>
        <div>
            <button
                className="btn primary createGameItem"
                disabled={!gameName}
            >Начать игру
            </button>
        </div>
      </div>
    </section>
  );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;