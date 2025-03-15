import React, { useState } from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import './LoginPage.css';

const LoginPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleForm = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className='login-page'>
            {isRegistering ? <RegisterForm /> : <LoginForm />}
            <button onClick={toggleForm}>
                {isRegistering ? 'Back to Login' : 'Register'}
            </button>
        </div>
    );
};

export default LoginPage;