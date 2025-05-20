import React from 'react';
import './Header.css';
import logo from '../../assets/images/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="left-section">
        <img src={logo} alt="Логотип" className="logo-image" />
        <p className="logo-text">Planning Poker Game</p>
      </div>

      <div className="right-section">
        <div className="auth-buttons">
          <button className="btn primary">Зарегистрироваться через Google 🚀</button>
          <button className="btn secondary">Начать новую игру</button>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
export default Header;