import React from 'react';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        {/* Здесь будет основное содержимое вашего приложения */}
        <h1>Добро пожаловать в Planning Poker</h1>
        <p>Начните игру или присоединитесь к существующей сессии</p>
        
        {/* Дополнительные компоненты будут добавляться здесь */}
      </main>
      
      {/* Подвал можно добавить позже */}
    </div>
  );
}

export default App;