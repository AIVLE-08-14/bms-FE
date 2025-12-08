// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AivleLogo from '../assets/aivle_logo.png';

// ✅ .env.local 에서 읽어온 백엔드 주소 사용 (예: http://localhost:8080)
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth`;

export default function SignupPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formData.password !== formData.passwordConfirm) {
            setError("Passwords do not match.");
            return;
        }

        const dataToSend = {
            email: formData.email,
            password: formData.password,
            name: formData.name
        };

        try {
            const res = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            console.log(res); // 요청 결과 확인용

            if (!res.ok) {
                if (res.status === 409) {
                    setError("Email is already in use.");
                } else {
                    const payload = await res.json().catch(() => null);
                    setError(payload?.message || "Sign up failed. Please try again.");
                }
                return;
            }

            alert("Sign up completed. Please log in.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("An error occurred during sign up. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={3} sx={{ p: 5, width: '100%', borderRadius: 4, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img
                        src={AivleLogo}
                        alt="AIVLE Logo"
                        style={{ width: 200, height: 'auto' }}
                    />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    AIVLE Library Sign Up
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSignup} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email (ID)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        name="passwordConfirm"
                        type="password"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        error={formData.password !== formData.passwordConfirm && formData.passwordConfirm.length > 0}
                        helperText={formData.password !== formData.passwordConfirm && formData.passwordConfirm.length > 0 ? "Passwords do not match." : ""}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 4, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        SignUp
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};
