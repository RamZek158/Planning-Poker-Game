import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
    HashRouter
} from 'react-router';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HashRouter>
    <App />
</HashRouter>);