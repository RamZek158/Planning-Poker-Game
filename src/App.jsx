import React from 'react';
import {
    Header,
    HomePage
} from './components';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {/* Здесь будет основное содержимое вашего приложения */}
        <HomePage/>
        {/* Дополнительные компоненты будут добавляться здесь */}
      </main>
      
      {/* Подвал можно добавить позже */}
    </div>
  );
}

export default App;