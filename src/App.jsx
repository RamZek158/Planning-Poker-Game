import React from 'react';
import { Routes, Route } from 'react-router';
import RouteWithHeader from './RouteWithHeader'
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
        <Route path={'/'} element={<RouteWithHeader />}>
            <Route path={'/'} element={<HomePage />} />
            <Route path={'/create-game'} element={<CreateGame />} />
        </Route>
    </Routes>
    </div>
  );
}

export default App;