"use client";

import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
    Stack,
    Container,
} from '@mui/material';
import { User, Lock, Eye, EyeSlash, Category } from 'iconsax-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ใช้ความสามารถในการ Redirect ของ NextAuth โดยตรง (ลบ redirect: false ออก)
            await signIn('credentials', {
                username,
                password,
                redirectTo: callbackUrl,
            });
        } catch (err: any) {
            // ถ้าเป็น error จากการยกเลิกโดยระบบ Next.js (เป็นปกติ) ให้ข้ามไป
            if (err?.type === 'CredentialsSignin') {
                setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
            } else {
                setError('เข้าสู่ระบบสำเร็จ กำลังพาคุณไป...');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
        }}>
            <Container maxWidth="xs" sx={{ py: 4 }}>
                <Box sx={{ p: 4 }}>
                    {/* Minimalist Logo Image */}
                    <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src="/images/logo-new.png"
                            alt="SNNP Logo"
                            width={220}
                            height={75}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, letterSpacing: '-1px', textAlign: 'center', fontFamily: 'var(--font-prompt)', fontSize: '1.5rem' }}>
                        ระบบจัดการบัตรพนักงาน
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 4, fontWeight: 500, textAlign: 'center', fontFamily: 'var(--font-prompt)' }}>
                        เข้าสู่ระบบ
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                id="login-username-input"
                                label="Username"
                                fullWidth
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="standard"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <User size={20} color="#94A3B8" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <TextField
                                id="login-password-input"
                                label="Password"
                                fullWidth
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                variant="standard"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock size={20} color="#94A3B8" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                    {showPassword ? <EyeSlash size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                disableElevation
                                sx={{
                                    py: 2,
                                    mt: 2,
                                    borderRadius: '12px',
                                    backgroundColor: '#1E293B',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor: '#0F172A',
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </Stack>
                    </form>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 8, color: '#94A3B8', fontWeight: 500 }}>
                        © 2026 SNNP
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
