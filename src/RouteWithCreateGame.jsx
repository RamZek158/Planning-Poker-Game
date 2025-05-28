import React from 'react';
import { Outlet } from 'react-router';
import { CreateGame } from './components';


const RouteWithCreateGame = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

RouteWithCreateGame.displayName = 'RouteWithCreateGame';
export default RouteWithCreateGame;