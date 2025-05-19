import React from 'react';
import './Header.css';
import logo from '../../assets/images/logo.png';
import profileIcon from '../../assets/images/profile-icon.png'; // Импорт из той же папки

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
        <div className="profile-icon-wrapper">
          <img 
            src={profileIcon} 
            alt="Профиль" 
            className="profile-icon"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDQuMDRjMS4xODQgMCAyLjE2Ljg3NiAyLjE2IDEuOTZzLS45NzYgMS45Ni0yLjE2IDEuOTYtMi4xNi0uODc2LTIuMTYtMS45Ni45NzYtMS45NiAyLjE2LTEuOTZtMCAxMC4wOGMzLjAzIDAgNS44NC0xLjI0IDcuODEtMy4yNnYtLjYyYzAtMi4yMi0xLjc4LTQuMDQtNC00LjA0cy00IDEuODItNCA0LjA0djEuMDZjMi4xOCAxLjQyIDQuNzIgMi4yMiA3LjM1IDIuMjIgMi4xMyAwIDQuMTctLjYgNS45Ni0xLjY0LjM2LTIuNDItLjY0LTQuODgtMi40LTYuNzQtMS4zMi0xLjE0LTMuMDYtMS44Mi00LjkyLTEuODJ6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=='
            }}
          />
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
export default Header;