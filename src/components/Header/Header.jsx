import React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './Header.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router';
import { useCookies } from 'react-cookie';
import { googleLogout , useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { savePlayer } from './../../utils';


const Header = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['logged-user-info']);
    const user = cookies['logged-user-info'];
    const navigate = useNavigate();

    const handleCreateNewGame = React.useCallback(() => {
        navigate('/create-game');
    }, [navigate]);

    const login = useGoogleLogin({
        select_account: true,
        onSuccess:  async (tokenResponse) => {
            console.log('tokenResponse:', tokenResponse);
            console.log('Access Token:', tokenResponse.access_token);

            // Fetch user profile info using the access token
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo ',
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const { name, sub, email, picture } = userInfo.data;
                setCookie('logged-user-info', {
                    logged_as: 'google',
                    logged_in: new Date().getTime(),
                    user_id: sub,
                    user_name: name,
                    user_email: email,
                    user_picture: picture,
                    expires_in: 3599 * 1000 + new Date().getTime()
                });
                savePlayer({
                    id: sub,
                    name,
                    picture,
                })
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        },
        onError: errorResponse =>  console.error('Login failed:', errorResponse)
    });

    const [menuOpen, setMenuOpen] = useState(false);
    const handleLogout = () => {
    removeCookie('logged-user-info', { path: '/' });
    window.location.reload(); // или navigate('/')
    };
    
    

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

                    <div className="profile-wrapper">
                        {!user ? (
                        <button className="btn primary" onClick={login}>Зарегистрироваться через Google 🚀</button>
                        ) : (
                        <>
                            <button className="btn secondary profile" onClick={() => setMenuOpen(!menuOpen)}>
                            <img src={user.user_picture} className="user-image" alt="avatar" />
                            <span className={`arrow ${menuOpen ? 'open' : ''}`}>❯</span>
                            <span>{user.user_name}</span>
                            </button>
                            {menuOpen && (
                            <div className="menuItem">
                                <button className="btn secondary profile" onClick={handleLogout}>Выйти 🚪</button>
                            </div>
                            )}
                        </>
                        )}
                    </div>
                    <button className="btn secondary" onClick={handleCreateNewGame}>Создать новую игру ✎</button>
                </div>
            </div>
        </header>
    );
};

Header.displayName = 'Header';
export default Header;