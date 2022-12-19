import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { loginUrl } from '../../url';
import { dangerToast, successToast } from '../../Components/Toast/Toast';
import { useNavigate, Link } from 'react-router-dom';
export default function Login({ darkTheme }) {
    const [cname, setcname] = useState('');
    useEffect(() => {
        if (darkTheme) {
            setcname('body-dark-theme')
        }
        else {
            setcname('');
        }
    }, [])
    const navigate = useNavigate()

    const [input, setInput] = useState({
        email: '',
        password: ''
    })

    const handleInput = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        if (!input.email || !input.password) {
            dangerToast("All Fields are Required !!");
            setLoading(false);
            return;
        }
        let { data } = await axios.post(loginUrl, input, { validateStatus: false })
        console.log(data);
        if (data.success) {
            localStorage.setItem('authToken', data.authToken);
            setLoading(false);
            navigate('/');
        }
        else {
            dangerToast(data.msg);
        }
        setLoading(false);
    }

    const [eye, setEye] = useState(true);

    return (
        <>
            <div className={cname}>

                <div className="loginPage">
                    <div className="loginContainer">
                        <div className="loginTop">
                            <Link to="/" className="Link">
                                <img src="/logo.png" className="loginLogo" alt="Login Logo" />
                            </Link>
                            <h3 className="loginSubtitle">CodeSaver</h3>
                            <h3 className="loginSubtitle">Sign in to UdayCodes</h3>
                        </div>
                        {/* <!-- <div className="inputBox">
                            <p className="responseText failure">incorrect username or password</p>
                        </div> --> */}
                        <div className="loginForm">
                            <div className="inputBox">
                                <label className="label">Email</label>
                                <input type="email" className="input" autoComplete={false} autoFocus={true} name="email" onChange={(e) => handleInput(e)} value={input.email} placeholder="Email" />
                            </div>
                            <div className="inputBox passwordBox">
                                <label className="label">Password</label>
                                <input type={eye ? "password" : "text"} autoComplete={false} className="input" name="password" onChange={(e) => handleInput(e)} value={input.password} placeholder="Password" />
                                <i onClick={() => setEye(!eye)} className={eye ? "uil uil-eye-slash icon passwordIcon" : "uil uil-eye icon passwordIcon"}></i>
                            </div>
                            <div className="inputBox">
                                <input value={loading ? "Loading" : "Sign In"} onClick={handleLogin} type="button" className="input buttonText button" placeholder="Email" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
