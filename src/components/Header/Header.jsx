import React from 'react';
import {useNavigate} from 'react-router';
import './Header.css';
import logo from '../../assets/images/logo.png';


const Header = () => {
    const navigate = useNavigate()

    const handleCreateNewGame = React.useCallback(() => {
        navigate('/create-game');
    }, [navigate]);

    return (
        <header className="header">
            <div className="left-section">
                <img src={logo} alt="Логотип" className="logo-image"/>
                <p className="logo-text">Planning Poker Game</p>
            </div>

            <div className="right-section">
                <div className="auth-buttons">
                    <button className="btn primary">Зарегистрироваться через Google 🚀</button>
                    <button className="btn secondary" onClick={handleCreateNewGame}>Начать новую игру</button>
                </div>
            </div>
        </header>
    );
};

Header.displayName = 'Header';
export default Header;