import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Swal from 'sweetalert2';
import { StatusCodes } from 'http-status-codes';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);

       try {
            const response = await api.login(email, password);

            if (response) {
                if (response.status === StatusCodes.CREATED) {
                   navigate('/homePage');
                } else if (response.status === StatusCodes.BAD_REQUEST) {
                    Swal.fire('Error', 'Invalid credentials', 'error');
                }
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred during registration.', 'error');
        }
    };

    return (
        <div className="login-form">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;