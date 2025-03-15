import React, { useState } from 'react';
import api from '../../api/api';
import { StatusCodes } from 'http-status-codes';
import Swal from 'sweetalert2';

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Email:', email);
        
        try {
            const response = await api.register(username, email, password);

            if (response) {
                console.log(`Status: ${response.status}`);
                if (response.status === StatusCodes.CREATED) {
                    Swal.fire('Success', 'Registration successful!', 'success');
                } else if (response.status === StatusCodes.CONFLICT) {
                    Swal.fire('Error', 'User already exists!', 'error');
                };
            };
        } catch (error) {
            Swal.fire('Error', 'An error occurred during registration.', 'error');
        }
    };

    return (
        <div className="register-form">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;