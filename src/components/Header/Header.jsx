import React from 'react';
import {useNavigate} from 'react-router';
import './Header.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleOneTapLogin } from '@react-oauth/google';


const Header = () => {
    const navigate = useNavigate()

    const handleCreateNewGame = React.useCallback(() => {
        navigate('/create-game');
    }, [navigate]);


        useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
    console.log(credentialResponse);
    },
        onError: () => {
    console.log('Login Failed');
    },
    });
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });

    
    return (
        <header className="header">
            <div className="left-section">
                <Link to='/' className="left-section">
                <img src={logo} alt="Логотип" className="logo-image" />
                </Link>
                <p className="whiteTextLink">Planning Poker Game</p>
            </div>

            <div className="right-section">
                <div className="auth-buttons">
                    <button className="btn primary" onClick={() => login()}>Зарегистрироваться через Google 🚀</button>
                    <button className="btn secondary" onClick={handleCreateNewGame}>Начать новую игру</button>
                </div>
            </div>
        </header>
    );
};

Header.displayName = 'Header';
export default Header;