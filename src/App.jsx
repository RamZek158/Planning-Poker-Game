import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    Header,
    HomePage,
    CreateGame
} from './components';
import './App.css';

function App() {
  return (
  <div className="app">
    <Routes>
      <Route Component={RouteWithHeader}>
      </Route>
    </Routes>
      <Header />
      <main className="main-content">
          {/* <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-game" element={<CreateGame />} />
          </Routes> */}
          
        <HomePage/>
        {/* Дополнительные компоненты будут добавляться здесь */}
      </main>
      
      {/* Подвал можно добавить позже */}
    </div>
  );
}

export default App;