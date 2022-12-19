import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
export default function Navbar({ darkTheme, setDarkTheme }) {

    const location = useLocation();
    const navigate = useNavigate()

    if (location.pathname == '/login') {
        return <>
        </>
    }
    const logOut = () => {
        localStorage.removeItem('authToken');
        navigate('/login')
    }

    return (
        <header className="header">
            <nav className="nav container">
                <div className="logoArea">
                    <Link to="/" className="logoArea">
                        <img src="/logo.png" className="logoImg" alt="logo" />
                        <h2 className="logoText">CODE-SAVER</h2>
                    </Link>
                </div>
                <ul className="navList">
                    <li>
                        <Link to="/write" className="navLink">Write</Link>
                    </li>
                    <li>
                        <p onClick={logOut} className="navLink">Log Out</p>
                    </li>
                    <li>
                        <div className="navLink">
                            {
                                darkTheme ?
                                    <i id="theme-change" onClick={() => setDarkTheme(!darkTheme)} className="uil uil-sun buttonIcon"></i>
                                    :
                                    <i id="theme-change" onClick={() => setDarkTheme(!darkTheme)} className="uil uil-moon buttonIcon"></i>
                            }
                        </div>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
