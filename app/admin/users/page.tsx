"use client";

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Button, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Stack, Chip, Avatar, CircularProgress, InputAdornment,
    Snackbar, Alert
} from '@mui/material';
import {
    UserAdd, Edit2, Trash, SearchNormal, UserSquare, Lock,
    Crown, ShieldTick, Profile2User, DirectboxNotif,
    TickCircle, Danger, Save2
} from 'iconsax-react';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 'user',
        status: 'active'
    });

    // Action loading states
    const [submitLoading, setSubmitLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Delete Confirmation states
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                username: user.username || '',
                password: '',
                role: user.role || 'user',
                status: user.status || 'active'
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                username: '',
                password: '',
                role: 'user',
                status: 'active'
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        if (!submitLoading) {
            setOpen(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: editingUser ? 'แก้ไขผู้ใช้งานสำเร็จ' : 'สร้างผู้ใช้งานสำเร็จ',
                    severity: 'success'
                });
                await fetchUsers();
                setOpen(false);
            } else {
                const error = await res.text();
                setSnackbar({
                    open: true,
                    message: error || 'เกิดข้อผิดพลาด',
                    severity: 'error'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
                severity: 'error'
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDeleteClick = (user: any) => {
        setUserToDelete(user);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: 'ลบผู้ใช้งานเรียบร้อยแล้ว',
                    severity: 'success'
                });
                await fetchUsers();
                setDeleteConfirmOpen(false);
            } else {
                setSnackbar({
                    open: true,
                    message: 'เกิดข้อผิดพลาดในการลบผู้ใช้งาน',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
                severity: 'error'
            });
        } finally {
            setDeleteLoading(false);
            setUserToDelete(null);
        }
    };

    const filteredUsers = users.filter((u: any) =>
        (u.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (u.username?.toLowerCase() || '').includes(search.toLowerCase())
    );

    const stats = [
        { label: 'ผู้ใช้งานทั้งหมด', value: users.length, color: '#3B82F6', icon: <Profile2User variant="Bulk" color="#3B82F6" size={32} />, bg: '#EFF6FF' },
        { label: 'ผู้ดูแลระบบ (Admin)', value: users.filter((u: any) => u.role === 'admin').length, color: '#8B5CF6', icon: <Crown variant="Bulk" color="#8B5CF6" size={32} />, bg: '#F5F3FF' },
        { label: 'สถานะพร้อมใช้งาน', value: users.filter((u: any) => u.status === 'active').length, color: '#10B981', icon: <TickCircle variant="Bulk" color="#10B981" size={32} />, bg: '#ECFDF5' },
    ];

    return (
        <Box>
            {/* Page Title and Action */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'var(--font-sarabun)', color: '#1E293B' }}>
                        จัดการผู้ใช้งาน
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-sarabun)', mt: 0.5 }}>
                        จัดการข้อมูลบัญชีผู้ใช้ บทบาท และสิทธิ์การเข้าถึงระบบ
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<UserAdd size={22} variant="Bold" color="#fff" />}
                    onClick={() => handleOpen()}
                    sx={{
                        borderRadius: '14px', bgcolor: '#1E293B', textTransform: 'none', px: 3, py: 1.5,
                        fontFamily: 'var(--font-sarabun)', fontWeight: 700, fontSize: '0.95rem',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    สร้างผู้ใช้งานใหม่
                </Button>
            </Box>

            {/* Quick Stats Cards */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {stats.map((stat, i) => (
                    <Box key={i} sx={{ border: '1px solid #F1F5F9', flex: 1, minWidth: '240px', p: 3, borderRadius: '20px', bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2.5, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ width: 60, height: 60, borderRadius: '16px', bgcolor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontFamily: 'var(--font-sarabun)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-sarabun)' }}>
                                {stat.value}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                {/* Search Header */}
                <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                    <TextField
                        id="user-search-input"
                        placeholder="ค้นหาชื่อผู้ใช้งาน หรือ Username..."
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchNormal size={20} color="#6366F1" variant="TwoTone" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { border: 'none' } }
                        }}
                        sx={{ maxWidth: 450, '& .MuiInputBase-input': { fontFamily: 'var(--font-sarabun)', py: 1.5, fontSize: '0.95rem' } }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', py: 2.5 }}>ข้อมูลผู้ใช้งาน</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569' }}>Username</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569' }}>บทบาท</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569' }}>สถานะการใช้งาน</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', pr: 4 }}>จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={35} color="primary" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <DirectboxNotif size={64} color="#CBD5E1" variant="Bulk" />
                                        <Typography sx={{ mt: 2, fontFamily: 'var(--font-sarabun)', color: '#94A3B8', fontWeight: 500 }}>
                                            ไม่พบข้อมูลผู้ใช้งานที่กำลังค้นหา
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.map((user: any) => (
                                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{
                                                width: 42, height: 42,
                                                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                                                color: '#fff', fontSize: '1rem', fontWeight: 700
                                            }}>
                                                {user.name?.charAt(0) || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#1E293B', lineHeight: 1.2 }}>
                                                    {user.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'var(--font-sarabun)' }}>
                                                    สร้างเมื่อ: {new Date(user.createdAt).toLocaleDateString('th-TH')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: 'mono', color: '#475569', fontSize: '0.9rem', bgcolor: '#F1F5F9', px: 1, py: 0.5, borderRadius: '6px', display: 'inline-block' }}>
                                            {user.username}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === 'admin' ? (
                                            <Chip
                                                icon={<Crown size={14} variant="Bold" color="#8B5CF6" />}
                                                label="ADMIN"
                                                sx={{
                                                    fontWeight: 800, borderRadius: '8px', fontFamily: 'var(--font-sarabun)',
                                                    fontSize: '0.75rem', bgcolor: '#F5F3FF', color: '#8B5CF6',
                                                    border: '1px solid #DDD6FE'
                                                }}
                                            />
                                        ) : (
                                            <Chip
                                                icon={<UserSquare size={14} variant="Bold" color="#64748B" />}
                                                label="USER"
                                                sx={{
                                                    fontWeight: 800, borderRadius: '8px', fontFamily: 'var(--font-sarabun)',
                                                    fontSize: '0.75rem', bgcolor: '#F8FAFC', color: '#64748B',
                                                    border: '1px solid #E2E8F0'
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                bgcolor: user.status === 'inactive' ? '#EF4444' : '#10B981',
                                                boxShadow: `0 0 0 4px ${user.status === 'inactive' ? '#FEF2F2' : '#ECFDF5'}`
                                            }} />
                                            <Typography variant="body2" sx={{
                                                fontWeight: 700,
                                                color: user.status === 'inactive' ? '#EF4444' : '#10B981',
                                                fontFamily: 'var(--font-sarabun)', fontSize: '0.85rem'
                                            }}>
                                                {user.status === 'inactive' ? 'ระงับการใช้งาน' : 'พร้อมใช้งาน'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <IconButton onClick={() => handleOpen(user)} sx={{ color: '#3B82F6', '&:hover': { bgcolor: '#EFF6FF' } }}>
                                            <Edit2 size={20} variant="Bulk" color="#3B82F6" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(user)} sx={{ color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' } }}>
                                            <Trash size={20} variant="Bulk" color="#EF4444" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create/Edit Modal */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px', p: 1, backgroundImage: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 2, pt: 3, px: 4 }}>
                        <Box sx={{ p: 1.5, borderRadius: '16px', bgcolor: editingUser ? '#EFF6FF' : '#F0FDF4', display: 'flex' }}>
                            {editingUser ? <Edit2 variant="Bold" color="#3B82F6" size={28} /> : <UserAdd variant="Bold" color="#10B981" size={28} />}
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-sarabun)', color: '#1E293B', lineHeight: 1.1 }}>
                                {editingUser ? 'แก้ไขผู้ใช้งาน' : 'สร้างบัญชีผู้ใช้ใหม่'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-sarabun)', mt: 0.5 }}>
                                {editingUser ? 'อัปเดตข้อมูลและสิทธิ์การเข้าถึง' : 'ระบุรายละเอียดเพื่อเริ่มต้นใช้งานระบบ'}
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ px: 4, py: 2 }}>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                id="user-name-input"
                                label="ชื่อ-นามสกุล"
                                fullWidth
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                InputProps={{
                                    startAdornment: <UserSquare size={22} color="#6366F1" variant="TwoTone" style={{ marginRight: 12 }} />,
                                    sx: { borderRadius: '14px', fontFamily: 'var(--font-sarabun)', bgcolor: '#F8FAFC' }
                                }}
                            />
                            <TextField
                                id="user-username-input"
                                label="Username"
                                fullWidth
                                required
                                disabled={!!editingUser}
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                InputProps={{
                                    startAdornment: <ShieldTick size={22} color="#10B981" variant="TwoTone" style={{ marginRight: 12 }} />,
                                    sx: { borderRadius: '14px', fontFamily: 'var(--font-sarabun)', bgcolor: editingUser ? '#F1F5F9' : '#F8FAFC' }
                                }}
                            />
                            <TextField
                                id="user-password-input"
                                label={editingUser ? "ตั้งรหัสผ่านใหม่ (ข้ามได้ถ้าไม่เปลี่ยน)" : "กำหนดรหัสผ่าน"}
                                type="password"
                                fullWidth
                                required={!editingUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                InputProps={{
                                    startAdornment: <Lock size={22} color="#F59E0B" variant="TwoTone" style={{ marginRight: 12 }} />,
                                    sx: { borderRadius: '14px', fontFamily: 'var(--font-sarabun)', bgcolor: '#F8FAFC' }
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <TextField
                                    id="user-role-select"
                                    select
                                    label="กำหนดบทบาท"
                                    fullWidth
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    InputProps={{
                                        startAdornment: <Crown size={22} color="#8B5CF6" variant="TwoTone" style={{ marginRight: 12 }} />,
                                        sx: { borderRadius: '14px', fontFamily: 'var(--font-sarabun)', bgcolor: '#F8FAFC' }
                                    }}
                                >
                                    <MenuItem value="admin" sx={{ fontFamily: 'var(--font-sarabun)' }}>ผู้ดูแลระบบ (Admin)</MenuItem>
                                    <MenuItem value="user" sx={{ fontFamily: 'var(--font-sarabun)' }}>ผู้ใช้งานทั่วไป (User)</MenuItem>
                                </TextField>
                                <TextField
                                    id="user-status-select"
                                    select
                                    label="สถานะการใช้งาน"
                                    fullWidth
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    InputProps={{
                                        startAdornment: <TickCircle size={22} color={formData.status === 'active' ? '#10B981' : '#EF4444'} variant="TwoTone" style={{ marginRight: 12 }} />,
                                        sx: { borderRadius: '14px', fontFamily: 'var(--font-sarabun)', bgcolor: '#F8FAFC' }
                                    }}
                                >
                                    <MenuItem value="active" sx={{ fontFamily: 'var(--font-sarabun)' }}>พร้อมใช้งาน (Active)</MenuItem>
                                    <MenuItem value="inactive" sx={{ fontFamily: 'var(--font-sarabun)' }}>ระงับการใช้งาน (Inactive)</MenuItem>
                                </TextField>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 4, pt: 2, justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            disabled={submitLoading}
                            onClick={handleClose}
                            sx={{ fontFamily: 'var(--font-sarabun)', color: '#64748B', fontWeight: 600, px: 3 }}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitLoading}
                            startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : <Save2 size={20} variant="Bold" color="#fff" />}
                            sx={{
                                borderRadius: '14px', bgcolor: '#1E293B', px: 5, py: 1.5,
                                fontFamily: 'var(--font-sarabun)', fontWeight: 700,
                                boxShadow: '0 10px 15px -3px rgba(30, 41, 59, 0.2)',
                                '&:hover': { bgcolor: '#000' }
                            }}
                        >
                            {submitLoading ? 'กำลังบันทึก...' : (editingUser ? 'บันทึกการแก้ไข' : 'สร้างบัญชีผู้ใช้')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => !deleteLoading && setDeleteConfirmOpen(false)}
                PaperProps={{
                    sx: { borderRadius: '24px', p: 1, maxWidth: '400px', width: '100%' }
                }}
            >
                <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
                    <Box sx={{
                        width: 80, height: 80, borderRadius: '50%', bgcolor: '#FEF2F2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3
                    }}>
                        <Danger size={48} variant="Bold" color="#EF4444" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'var(--font-sarabun)', mb: 1 }}>
                        ยืนยันการลบผู้ใช้?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-sarabun)', mb: 3 }}>
                        คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ <strong>{userToDelete?.name}</strong>? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
                    <Button
                        disabled={deleteLoading}
                        onClick={() => setDeleteConfirmOpen(false)}
                        sx={{ fontFamily: 'var(--font-sarabun)', color: '#64748B', fontWeight: 600, flex: 1, borderRadius: '12px' }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        disabled={deleteLoading}
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{
                            fontFamily: 'var(--font-sarabun)', bgcolor: '#EF4444', fontWeight: 700, flex: 1, borderRadius: '12px',
                            '&:hover': { bgcolor: '#DC2626' }
                        }}
                    >
                        {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'ยืนยันการลบ'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Global Notification Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-sarabun)',
                        fontWeight: 600,
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
