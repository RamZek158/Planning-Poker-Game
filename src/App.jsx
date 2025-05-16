import React from 'react';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import './styles/mian.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <MainPage />
      </main>
    </div>
  );
}