import React from 'react';
import { Routes, Route } from 'react-router';
import { CookiesProvider } from 'react-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import RouteWithHeader from './RouteWithHeader';
import {
    HomePage,
    CreateGame,
    GameRoom
} from './components';
import './App.css';
import GameNameProvider from "./providers/GameNameProvider";

const CLIENT_ID = '357030709892-0gb5a39m5gcb1tvfl5nc5eqkf37elcio.apps.googleusercontent.com'
function App() {
  return (
      <GoogleOAuthProvider clientId={CLIENT_ID}>
          <CookiesProvider>
              <GameNameProvider>
                  <div className="app">
                      <Routes>
                          <Route path={'/'} element={<RouteWithHeader />}>
                              <Route path={'/'} element={<HomePage />} />
                              <Route path={'/create-game'} element={<CreateGame />} />
                              <Route path={'/game/:gameId'} element={<GameRoom />} />
                          </Route>
                      </Routes>
                  </div>
              </GameNameProvider>
          </CookiesProvider>
      </GoogleOAuthProvider>
  );
}

export default App;