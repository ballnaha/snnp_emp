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
    Paper,
} from '@mui/material';
import { User, Lock, Eye, EyeSlash, Category } from 'iconsax-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Suspense } from 'react';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() && !password.trim()) {
            setError('กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ');
            setIsSuccess(false);
            return;
        }
        if (!username.trim()) {
            setError('กรุณากรอก Username');
            setIsSuccess(false);
            return;
        }
        if (!password.trim()) {
            setError('กรุณากรอก Password');
            setIsSuccess(false);
            return;
        }

        setLoading(true);
        setError('');
        setIsSuccess(false);

        try {
            const res = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
                setIsSuccess(false);
            } else if (res?.ok || res?.url) {
                setError('เข้าสู่ระบบสำเร็จ กำลังพาคุณไป...');
                setIsSuccess(true);
                window.location.href = callbackUrl;
            }
        } catch (err: any) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#F8FAFC',
            backgroundImage: `
                radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)
            `,
        }}>
            {/* Background Ornaments */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '15%',
                width: 300,
                height: 300,
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                zIndex: 0
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '10%',
                right: '15%',
                width: 350,
                height: 350,
                bgcolor: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
                <Paper elevation={0} sx={{
                    p: 5,
                    borderRadius: '32px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 0 20px rgba(99, 102, 241, 0.05)',
                }}>
                    {/* Minimalist Logo Image */}
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <Image
                            src="/images/logo-new.png"
                            alt="SNNP Logo"
                            width={180}
                            height={60}
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1, letterSpacing: '-0.5px', textAlign: 'center', fontFamily: 'var(--font-prompt)' }}>
                        ระบบจัดการบัตรพนักงาน
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 4, fontWeight: 500, textAlign: 'center', fontFamily: 'var(--font-prompt)' }}>
                        ลงชื่อเข้าใช้งานเข้าสู่ระบบ
                    </Typography>

                    {error && (
                        <Alert
                            severity={isSuccess ? "success" : "error"}
                            sx={{
                                mb: 3,
                                borderRadius: '12px',
                                fontFamily: 'var(--font-prompt)',
                                alignItems: 'center',
                                '& .MuiAlert-icon': { py: 0.5 }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontFamily: 'var(--font-prompt)', mb: 1, display: 'block', ml: 0.5 }}>
                                    Username
                                </Typography>
                                <TextField
                                    id="login-username-input"
                                    placeholder="กรอกชื่อผู้ใช้งาน"
                                    fullWidth
                                    name="username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) {
                                            setError('');
                                            setIsSuccess(false);
                                        }
                                    }}
                                    error={!isSuccess && (error.includes('Username') || error.includes('ข้อมูล'))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: '#ffffff',
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.8)', borderWidth: '2px' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                            '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                                            '&.Mui-error fieldset': { borderColor: '#EF4444' }
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            py: 1.5
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <User size={20} color={!isSuccess && (error.includes('Username') || error.includes('ข้อมูล')) ? '#EF4444' : '#94A3B8'} variant="Bulk" />
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, fontFamily: 'var(--font-prompt)', mb: 1, display: 'block', ml: 0.5 }}>
                                    Password
                                </Typography>
                                <TextField
                                    id="login-password-input"
                                    placeholder="กรอกรหัสผ่าน"
                                    fullWidth
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) {
                                            setError('');
                                            setIsSuccess(false);
                                        }
                                    }}
                                    error={!isSuccess && (error.includes('Password') || error.includes('ข้อมูล'))}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '16px',
                                            backgroundColor: '#ffffff',
                                            fontFamily: 'var(--font-prompt)',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.2s',
                                            '& fieldset': { borderColor: 'rgba(226, 232, 240, 0.8)', borderWidth: '2px' },
                                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                                            '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                                            '&.Mui-error fieldset': { borderColor: '#EF4444' }
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            py: 1.5
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock size={20} color={!isSuccess && (error.includes('Password') || error.includes('ข้อมูล')) ? '#EF4444' : '#94A3B8'} variant="Bulk" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#94A3B8' }}>
                                                        {showPassword ? <EyeSlash size={20} variant="Bulk" /> : <Eye size={20} variant="Bulk" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }
                                    }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                disableElevation
                                sx={{
                                    py: 1.5,
                                    mt: 2,
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontFamily: 'var(--font-prompt)',
                                    boxShadow: '0 8px 16px rgba(99, 102, 241, 0.25)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(99, 102, 241, 0.35)',
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        background: '#E2E8F0',
                                        color: '#94A3B8'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
                            </Button>
                        </Stack>
                    </form>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 6, color: '#94A3B8', fontWeight: 500, fontFamily: 'var(--font-prompt)' }}>
                        © {new Date().getFullYear()} SNNP
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <CircularProgress />
            </Box>
        }>
            <LoginContent />
        </Suspense>
    );
}
