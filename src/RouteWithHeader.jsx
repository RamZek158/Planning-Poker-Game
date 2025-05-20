import React from 'react';
import { Outlet } from 'react-router';
import { Header } from './components';


const RouteWithHeader = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

RouteWithHeader.displayName = 'RouteWithHeader';
export default RouteWithHeader;