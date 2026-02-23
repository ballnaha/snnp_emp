"use client";

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    Divider,
    Stack,
    Alert,
    CircularProgress,
    MenuItem,
    Chip,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSquare, Lock, Edit, Save2, Crown, ShieldTick } from 'iconsax-react';

export default function ProfilePage() {
    const { data: session, update } = useSession();

    // States
    const [name, setName] = useState(session?.user?.name || '');
    const [username, setUsername] = useState((session?.user as any)?.username || '');
    const [role, setRole] = useState((session?.user as any)?.role || 'user');
    const [status, setStatus] = useState('active'); // Default to active
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (newPassword && newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    username,
                    role, // Added role
                    currentPassword: newPassword ? currentPassword : undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
                update();
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const error = await res.text();
                setMessage({ type: 'error', text: error || 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{
                fontWeight: 700,
                mb: 4,
                fontFamily: 'var(--font-prompt)',
                color: '#1E293B'
            }}>
                ตั้งค่าโปรไฟล์
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4
            }}>
                {/* Left Side: Avatar & Summary */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 320px' } }}>
                    <Paper sx={{ p: 4, borderRadius: '20px', textAlign: 'center', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <Avatar
                            sx={{
                                width: 120,
                                height: 120,
                                mx: 'auto',
                                mb: 2,
                                bgcolor: '#3B82F6',
                                fontSize: '3rem',
                                fontWeight: 700
                            }}
                        >
                            {session?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'var(--font-prompt)' }}>
                            {session?.user?.name}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1, mb: 2 }}>
                            <Chip
                                label={(session?.user as any)?.role?.toUpperCase()}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 700, borderRadius: '6px', fontFamily: 'var(--font-prompt)' }}
                            />
                            <Chip
                                label="ACTIVE"
                                size="small"
                                color="success"
                                sx={{ fontWeight: 700, borderRadius: '6px', fontFamily: 'var(--font-prompt)' }}
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2} sx={{ textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <UserSquare size={18} color="#94A3B8" />
                                <Typography variant="body2" sx={{ fontFamily: 'var(--font-prompt)', color: '#475569' }}>
                                    Username: <strong>{(session?.user as any)?.username}</strong>
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>

                {/* Right Side: Forms */}
                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        {message.text && (
                            <Alert severity={message.type as any} sx={{ mb: 4, borderRadius: '12px', fontFamily: 'var(--font-prompt)' }}>
                                {message.text}
                            </Alert>
                        )}

                        <form onSubmit={handleUpdateProfile}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'var(--font-prompt)' }}>
                                <Edit size={22} color="#3B82F6" variant="Bulk" />
                                ข้อมูลทั่วไป
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <TextField
                                        id="profile-name-input"
                                        label="ชื่อ-นามสกุล"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                    <TextField
                                        id="profile-username-input"
                                        label="ชื่อผู้ใช้งาน (Username)"
                                        fullWidth
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                                    <TextField
                                        id="profile-role-select"
                                        select
                                        label="บทบาท (Role)"
                                        fullWidth
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        InputProps={{
                                            startAdornment: <Crown size={20} color="#3B82F6" style={{ marginRight: 8 }} />
                                        }}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    >
                                        <MenuItem value="admin" sx={{ fontFamily: 'var(--font-prompt)' }}>Admin</MenuItem>
                                        <MenuItem value="user" sx={{ fontFamily: 'var(--font-prompt)' }}>User</MenuItem>
                                    </TextField>
                                    <TextField
                                        id="profile-status-select"
                                        select
                                        label="สถานะ (Status)"
                                        fullWidth
                                        value={status}
                                        disabled // Protect status from self-deactivation
                                        InputProps={{
                                            startAdornment: <ShieldTick size={20} color="#10B981" style={{ marginRight: 8 }} />
                                        }}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    >
                                        <MenuItem value="active" sx={{ fontFamily: 'var(--font-prompt)' }}>Active</MenuItem>
                                        <MenuItem value="inactive" sx={{ fontFamily: 'var(--font-prompt)' }}>Inactive</MenuItem>
                                    </TextField>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 5 }} />

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'var(--font-prompt)' }}>
                                <Lock size={22} color="#F59E0B" variant="Bulk" />
                                เปลี่ยนรหัสผ่าน
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', mb: 3, fontFamily: 'var(--font-prompt)' }}>
                                * เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน
                            </Typography>

                            <Stack spacing={3}>
                                <TextField
                                    id="profile-current-password"
                                    label="รหัสผ่านปัจจุบัน"
                                    type="password"
                                    fullWidth
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 3
                                }}>
                                    <TextField
                                        id="profile-new-password"
                                        label="รหัสผ่านใหม่"
                                        type="password"
                                        fullWidth
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                    <TextField
                                        id="profile-confirm-password"
                                        label="ยืนยันรหัสผ่านใหม่"
                                        type="password"
                                        fullWidth
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        sx={{ '& .MuiInputBase-root': { fontFamily: 'var(--font-prompt)' } }}
                                    />
                                </Box>
                            </Stack>

                            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <Save2 variant="Bulk" />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        backgroundColor: '#1E293B',
                                        fontFamily: 'var(--font-prompt)',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        '&:hover': { backgroundColor: '#0F172A' }
                                    }}
                                >
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}
