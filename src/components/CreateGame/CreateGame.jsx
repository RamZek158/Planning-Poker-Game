import React from 'react';
import './CreateGame.css';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie'; // <-- добавляем
import { T_SHIRT_VOTING_SYSTEM, FIBONACCI_VOTING_SYSTEM } from '../../utils';
import profileIcon from '../../assets/images/profile-icon.png';
import { useGameNameContext }  from '../../providers/GameNameProvider';
import { addUser } from '../../api/users/users';
// import { gameId, gameName, votingSyst } from '../../api/gameSettings/gameSettings';

const CreateGame = () => {
    //const [gameName, setGameName] = React.useState('');
    const [votingType, setVotingType] = React.useState(FIBONACCI_VOTING_SYSTEM);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [gameId, setGameId] = React.useState('');
    const [customName, setCustomName] = React.useState('');
    const [error, setError] = React.useState('');
    const { gameName, setGameName } = useGameNameContext();

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

    const handleLogin = React.useCallback(() => {
        if (!customName.trim()) {
            setError('Поле не может быть пустым');
            return;
        }

        // Сохраняем анонимного пользователя в куки
        const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;
        const userInfo = {
            logged_as: 'anonymous',
            user_id: userId,
            user_name: customName,
            user_email: undefined,
            user_picture: profileIcon,
            logged_in: new Date().getTime(),
            expires_in: 3599 * 1000 + new Date().getTime()
        };

        setCookie('logged-user-info', userInfo);
        addUser({
                    id: userId,
                    name: customName,
                    picture: profileIcon
                });
        // gameName({
        //             gameName
        //         });

            
        setModalOpen(false);
        setGameId(Math.random().toString(36).substring(2, 10) + Date.now().toString(36));
    }, [customName, setCookie, setGameId, setModalOpen]);

    const handleCreateGame = React.useCallback(() => {
        if (!gameName.trim()) return;

        if (!isUserRegistered()) {
            setModalOpen(true);
        } else {
            setGameId(Math.random().toString(36).substring(2, 10) + Date.now().toString(36));
        }
    }, [gameName, setModalOpen, navigate, setGameId]);

    React.useEffect(() => {
        if (gameId) {
            navigate(`/game/${gameId}`);
        }
    }, [gameId])

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
            {modalOpen && (
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
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        <div>
                            <button
                                className="btn primary"
                                onClick={handleLogin}
                                disabled={!customName.trim()}
                                style={{ marginTop: '10px' }}
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

CreateGame.displayName = 'CreateGame';
export default CreateGame;