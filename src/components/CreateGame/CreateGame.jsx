import React, { useState } from 'react';
import './CreateGame.css'; // Стили для страницы

const CreateGame = () => {
  const [gameName, setGameName] = useState('');
  const [scaleType, setScaleType] = useState('fibonacci');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Создаем игру:', { gameName, scaleType });
    // Здесь будет логика создания игры
  };

  return (
    <div className="create-game-container">
      <h1>Создать новую игру</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="gameName">Название игры:</label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Введите название игры"
            required
          />
        </div>

        <div className="form-group">
          <label>Шкала оценки:</label>
          <div className="scale-options">
            <label>
              <input
                type="radio"
                name="scaleType"
                value="fibonacci"
                checked={scaleType === 'fibonacci'}
                onChange={() => setScaleType('fibonacci')}
              />
              Fibonacci (1, 2, 3, 5, 8, 13, 21)
            </label>
            
            <label>
              <input
                type="radio"
                name="scaleType"
                value="t-shirt"
                checked={scaleType === 't-shirt'}
                onChange={() => setScaleType('t-shirt')}
              />
              T-Shirt (XS, S, M, L, XL)
            </label>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Создать игру
        </button>
      </form>
    </div>
  );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;