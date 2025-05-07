import React, { useEffect, useState } from "react";
import './SignAndLog.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';
const SignAndLog = () => {
    const [Cook, setCookies] = useCookies("token");
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');

    // أخطاء منفصلة
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const Navigate = useNavigate();

    const resetErrors = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setPasswordConfirmError('');
        setGeneralError('');
    };

    const handleSignUpClick = () => {
        resetErrors();
        setIsSignUpActive(true);
    };
    const handleSignInClick = () => {
        resetErrors();
        setIsSignUpActive(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        resetErrors();

        let hasError = false;

        if (!name) {
            setNameError('Name is required');
            hasError = true;
        }
        if (!email) {
            setEmailError('Email is required');
            hasError = true;
        }
        if (!password) {
            setPasswordError('Password is required');
            hasError = true;
        }
        if (password !== passwordConfirm) {
            setPasswordConfirmError('Passwords do not match!');
            hasError = true;
        }

        if (hasError) return;

        try {
            const response = await axios.post('http://localhost:8000/api/v2/auth/sign_up', {
                name,
                email,
                password,
                passwordConfirm,
            });
            console.log("Sign up response:", response.data);
            setCookies("token", response.data.token);
            Navigate("/");
            // window.location.href = '/';
        } catch (error) {
            console.error('Sign up error:', error);
            console.log(
                name,
                email,
                password,
                passwordConfirm,);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        resetErrors();

        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/v2/auth/login', {
                email,
                password,
            });

            localStorage.setItem('token', response.data.token);
            setCookies("token", response.data.token);
            // window.location.href = '/';
            Navigate("/");
        } catch (error) {
            console.error('Sign in error:', err.response);
            setGeneralError('Invalid email or password. Please try again.');
        }
    };



    return (
        <div className="log_and_sign">
            <div className={`container ${isSignUpActive ? 'active' : ''}`} id="container">

                {/* Sign Up Form */}
                <div className="form-container sign-up">
                    <form onSubmit={handleSignUp}>
                        <h1>Create Account</h1>
                        {generalError && <p className="error">{generalError}</p>}
                {/* Sign In With Google */}
                <div className="window_signin" style={{ textAlign: "center" }}>
                            <button
                                onClick={(e) => {
                                    event.preventDefault(e);
                                    const width = 500;
                                    const height = 600;
                                    const left = (window.innerWidth - width) / 2;
                                    const top = (window.innerHeight - height) / 1;

                                    window.open(
                                        "http://localhost:8000/auth/google",
                                        "Google Login",
                                        `width=${width},height=${height},top=${top},left=${left}`
                                    );
                                }}
                            >
                                <img
                                    src="/image/g-logo.png"
                                    alt="google logo"
                                    style={{ width: 25, height: 25 }}
                                />
                                <span>Sign in with Google</span>
                            </button>
                        </div>
                        {/* Sign In With Google */}
                        <span>or use your email for registration</span>
                        <div className="input_error">
                            {nameError && <p className="error">{nameError}</p>}
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="input_error">
                            {emailError && <p className="error">{emailError}</p>}
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input_error">
                            {passwordError && <p className="error">{passwordError}</p>}
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input_error">
                            {passwordConfirmError && <p className="error">{passwordConfirmError}</p>}
                            <input type="password" placeholder="Confirm Password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                        </div>
                        <Link to="/sign_school"><a>Register as an Educational Institution!!!</a></Link>
                                
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in">
                    <form onSubmit={handleSignIn}>
                        <h1>Sign In</h1>


                        {/* Sign In With Google */}
                        <div className="window_signin" style={{ textAlign: "center" }}>
                            <button
                                onClick={(e) => {
                                    event.preventDefault(e);
                                    const width = 500;
                                    const height = 600;
                                    const left = (window.innerWidth - width) / 2;
                                    const top = (window.innerHeight - height) / 1;

                                    window.open(
                                        "http://localhost:8000/auth/google",
                                        "Google Login",
                                        `width=${width},height=${height},top=${top},left=${left}`
                                    );
                                }}
                            >
                                <img
                                    src="/image/g-logo.png"
                                    alt="google logo"
                                    style={{ width: 25, height: 25 }}
                                />
                                <span>Sign in with Google</span>
                            </button>
                        </div>
                        {/* Sign In With Google */}


                        <span>or use your email and password</span>
                        <div className="input_error">
                            {generalError && <p className="error">{generalError}</p>}
                            {emailError && <p className="error">{emailError}</p>}
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input_error">
                            {passwordError && <p className="error">{passwordError}</p>}
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        <a href="#">Forgot Your Password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* Toggle Panels */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of the site's features</p>
                            <button className="hidden" onClick={handleSignInClick}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, Friend!</h1>
                            <p>Register with your personal details to use all of the site's features</p>
                            <button className="hidden" onClick={handleSignUpClick}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SignAndLog;