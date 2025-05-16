import React from 'react';
import Header from './src/components/Header';
import MainPage from './pages/MainPage';
import './styles/main';

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