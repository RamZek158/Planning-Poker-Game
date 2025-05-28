import React from 'react';
import './CreateGame.css';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'; // <-- добавляем
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from '../../utils';
import profileIcon from '../../assets/images/profile-icon.png';

const CreateGame = () => {
  const [gameName, setGameName] = React.useState('');
  const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['logged-user-info']); // <-- используем те же куки, что в Header.jsx

  const t_shirt_system_string = T_SHIRT_VOTING_SYSTEM.join(', ');
  const fibonacci_system_string = FIBONACCI_VOTING_SYSTEM.join(', ');

  const handleVotingTypeChange = React.useCallback((event) => {
    setVotingType(event.target.value);
  }, []);

  const handleChangeGameName = React.useCallback((event) => {
    setGameName(event.target.value);
  }, []);

  // Проверяем, есть ли пользователь в куках
  const isUserRegistered = () => {
    return !!cookies['logged-user-info'];
  };

  const generateGameId = () => {
    return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  };

  const handleLogin = () => {
    if (!customName.trim()) {
      setError('Имя не может быть пустым');
      return;
    }

    const userId = "anon_" + Math.random().toString(36).substring(2, 10);

    // Сохраняем анонимного пользователя в куки
    const userInfo = {
      logged_as: 'anonymous',
      user_id: userId,
      user_name: customName,
      user_email: undefined,
      user_picture: profileIcon,
      logged_in: new Date().getTime(),
    };

    setCookie('logged-user-info', userInfo, {
      path: '/',
      maxAge: 3600, // 1 час жизни
    });

    setIsModalOpen(false);
    const gameId = generateGameId();
    navigate(`/game/${gameId}`);
  };

  const handleCreateGame = () => {
    if (!gameName.trim()) return;

    if (!isUserRegistered()) {
      setIsModalOpen(true);
    } else {
      const gameId = generateGameId();
      navigate(`/game/${gameId}`);
    }
  };

  return (
    <section className="pageContainer middleAlignContainer">
      <div className="createGameSection">
        <div>
          <input
            type="text"
            onChange={handleChangeGameName}
            className="createGameItem"
            placeholder="Название игры"
            value={gameName}
          />
        </div>
        <select
          className="createGameItem"
          onChange={handleVotingTypeChange}
          value={votingType}
        >
          <option value={FIBONACCI_VOTING_SYSTEM}>
            {`Modified Fibonacci (${fibonacci_system_string})`}
          </option>
          <option value={T_SHIRT_VOTING_SYSTEM}>
            {`T-shirts (${t_shirt_system_string})`}
          </option>
        </select>
        <div>
          <button
            className="btn primary createGameItem"
            disabled={!gameName}
            onClick={handleCreateGame}
          >
            Начать игру 🎮
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Введите ваше имя</h3>
            <input
              type="text"
              placeholder="Ваше имя"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value);
                if (error) setError('');
              }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
              onClick={handleLogin}
              disabled={!customName.trim()}
              style={{ marginTop: '10px' }}
            >
              Войти
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;