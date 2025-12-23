// src/pages/LogInPage.jsx
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AivleLogo from '../assets/aivle_logo.png';
import { BASE_URL } from "../api/client.js"

const API_BASE_URL = `${BASE_URL}/api/v1/auth`;

export default function LogInPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!formData.email || !formData.password) {
            setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            console.log("Login Response:", res); // 🔍 디버깅용

            if (!res.ok) {
                if (res.status === 401) {
                    setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
                } else if (res.status === 404) {
                    setErrorMessage("계정을 찾을 수 없습니다.");
                } else {
                    setErrorMessage("로그인 중 오류가 발생했습니다.");
                }
                return;
            }

            const data = await res.json();
            console.log("Login Success Data:", data);
            console.log("Token:", data?.data?.token);
            console.log("User:", data?.data?.userId);
            // JWT 저장
            localStorage.setItem("token", data?.data?.token);
            localStorage.setItem("userId", JSON.stringify(data?.data?.userId));

            // 로그인 성공 → 홈으로 이동
            navigate("/");
        } catch (err) {
            console.error(err);
            setErrorMessage("로그인 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    p: 5,
                    width: '100%',
                    borderRadius: 4,
                    textAlign: 'center'
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img
                        src={AivleLogo}
                        alt="AIVLE Logo"
                        style={{ width: 200, height: 'auto' }}
                    />
                </Box>

                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                    AIVLE 도서관리 시스템
                </Typography>

                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="ID (이메일)"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 1, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        Login
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1, py: 1.5 }}
                        onClick={() => navigate('/signup')}
                    >
                        SignUp
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};
