"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, Button, TextField,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Stack, Chip, Avatar, CircularProgress, InputAdornment,
    Snackbar, Alert, TablePagination, Dialog, DialogContent, DialogActions
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
    UserAdd, Edit2, Trash, SearchNormal, UserSquare,
    Profile2User, DirectboxNotif, TickCircle, Personalcard,
    Buildings, Hierarchy, CalendarTick, DirectboxSend, DocumentDownload,
    Danger
} from 'iconsax-react';
import html2canvas from 'html2canvas';

export default function StaffManagementPage() {
    const router = useRouter();
    const badgeRef = React.useRef<HTMLDivElement>(null);
    const [staff, setStaff] = useState([]);
    const [selectedStaffForBadge, setSelectedStaffForBadge] = useState<any>(null);
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    // Snackbar states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Confirm delete state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({
                q: search,
                page: (page + 1).toString(),
                limit: rowsPerPage.toString()
            });
            const res = await fetch(`/api/staff?${query.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setStaff(data.staff);
                setTotalCount(data.pagination.total);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [search, page, rowsPerPage]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaff();
        }, 300); // Add a small debounce for search
        return () => clearTimeout(timer);
    }, [fetchStaff]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDeleteClick = (item: any) => {
        setStaffToDelete(item);
        setDeleteConfirmOpen(true);
    };

    const executeDelete = async () => {
        if (!staffToDelete) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/staff/${staffToDelete.id}`, { method: 'DELETE' });
            if (res.ok) {
                setSnackbar({ open: true, message: 'ลบข้อมูลสำเร็จ', severity: 'success' });
                fetchStaff();
                setDeleteConfirmOpen(false);
            } else {
                setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการลบข้อมูล', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', severity: 'error' });
        } finally {
            setDeleteLoading(false);
            setStaffToDelete(null);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const handleDownload = async (item: any) => {
        setDownloading(true);
        setSelectedStaffForBadge(item);

        // Wait for state update and rendering
        setTimeout(async () => {
            if (badgeRef.current) {
                try {
                    const canvas = await html2canvas(badgeRef.current, {
                        useCORS: true,
                        scale: 1, // Use scale 1 to keep exactly 650x1016
                        backgroundColor: null
                    });

                    const image = canvas.toDataURL("image/png", 1.0);
                    const link = document.createElement('a');
                    link.download = `badge_${item.emp_id}_${item.en_firstname}.png`;
                    link.href = image;
                    link.click();

                    setSnackbar({ open: true, message: 'ดาวน์โหลดรูปบัตรเรียบร้อยแล้ว', severity: 'success' });
                } catch (err) {
                    console.error(err);
                    setSnackbar({ open: true, message: 'เกิดข้อผิดพลาดในการดาวน์โหลด', severity: 'error' });
                } finally {
                    setDownloading(false);
                    // Don't clear selectedStaff immediately to avoid flickers before capture finishes
                    setTimeout(() => setSelectedStaffForBadge(null), 100);
                }
            } else {
                setDownloading(false);
                setSelectedStaffForBadge(null);
            }
        }, 800);
    };

    return (
        <Box>
            {/* Page Title and Action */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'var(--font-prompt)', color: '#1E293B' }}>
                        จัดการข้อมูลพนักงาน
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-prompt)', mt: 0.5 }}>
                        บันทึกและแก้ไขข้อมูลประวัติพนักงานสำหรับออกบัตร
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<UserAdd size={22} variant="Bold" color="#fff" />}
                    onClick={() => router.push('/admin/staff/new')}
                    sx={{
                        borderRadius: '12px', bgcolor: '#1E293B', textTransform: 'none', px: 2.5, py: 1,
                        fontFamily: 'var(--font-prompt)', fontWeight: 600, fontSize: '0.85rem',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        '&:hover': { bgcolor: '#000', transform: 'translateY(-2px)' },
                        transition: 'all 0.2s'
                    }}
                >
                    เพิ่มพนักงานใหม่
                </Button>
            </Box>

            <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #F1F5F9', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                {/* Search Header */}
                <Box sx={{ p: 3, bgcolor: '#fff', borderBottom: '1px solid #F1F5F9' }}>
                    <TextField
                        id="staff-search-input"
                        placeholder="ค้นหาชื่อ หรือ รหัสพนักงาน..."
                        fullWidth
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0); // Reset to first page on search
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchNormal size={20} color="#6366F1" variant="TwoTone" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { border: 'none' } }
                        }}
                        sx={{ maxWidth: 450, '& .MuiInputBase-input': { fontFamily: 'var(--font-prompt)', py: 1.5, fontSize: '0.95rem' } }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#475569', py: 2.5 }}>พนักงาน</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#475569' }}>รหัส / บัตร ปชช.</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#475569' }}>ฝ่าย / แผนก</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#475569' }}>วันที่เริ่มงาน</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#475569', pr: 4 }}>จัดการ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={35} color="primary" />
                                    </TableCell>
                                </TableRow>
                            ) : staff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <DirectboxNotif size={64} color="#CBD5E1" variant="Bulk" />
                                        <Typography sx={{ mt: 2, fontFamily: 'var(--font-prompt)', color: '#94A3B8', fontWeight: 500 }}>
                                            ไม่พบข้อมูลพนักงานที่ค้นหา
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : staff.map((item: any) => (
                                <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                            <Avatar
                                                src={item.file ? (item.file.startsWith('data:') ? item.file : `/api/uploads/${item.file}?v=${item.updated_at ? new Date(item.updated_at).getTime() : Date.now()}`) : ''}
                                                sx={{
                                                    width: 100, height: 99,
                                                    borderRadius: '16px',
                                                    bgcolor: '#F1F5F9',
                                                    border: '1px solid #E2E8F0',
                                                    color: '#6366F1', fontSize: '2rem', fontWeight: 700
                                                }}
                                                variant="rounded"
                                            >
                                                {item.th_firstname?.charAt(0) || 'E'}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontFamily: 'var(--font-prompt)', color: '#1E293B', lineHeight: 1.2, fontSize: '1.1rem' }}>
                                                    {item.th_firstname} {item.th_lastname}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-prompt)', mt: 0.5 }}>
                                                    {item.en_firstname} {item.en_lastname}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', color: '#6366F1', fontWeight: 700, fontSize: '0.95rem', bgcolor: '#EEF2FF', px: 1, py: 0.5, borderRadius: '6px', display: 'inline-block', width: 'fit-content' }}>
                                                ID: {item.emp_id}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'var(--font-prompt)', display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                                                <Personalcard size={14} /> {item.emp_card_id || '-'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Hierarchy size={16} color="#3B82F6" /> {item.department || '-'}
                                            </Typography>
                                            <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.85rem', color: '#64748B' }}>
                                                {item.section || '-'}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontFamily: 'var(--font-prompt)', fontSize: '0.95rem', color: '#1E293B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarTick size={18} color="#F59E0B" /> {formatDate(item.start_date)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 3, whiteSpace: 'nowrap' }}>
                                        <IconButton
                                            disabled={downloading}
                                            onClick={() => handleDownload(item)}
                                            title="Download Badge"
                                            sx={{ color: '#6366F1', '&:hover': { bgcolor: '#F5F3FF' } }}
                                        >
                                            {downloading && selectedStaffForBadge?.id === item.id ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                <DocumentDownload size={20} variant="Bold" color="#6366F1" />
                                            )}
                                        </IconButton>
                                        <IconButton onClick={() => router.push(`/admin/staff/edit/${item.id}`)} sx={{ color: '#3B82F6', '&:hover': { bgcolor: '#EFF6FF' } }}>
                                            <Edit2 size={20} variant="Bulk" color="#3B82F6" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(item)} sx={{ color: '#EF4444', '&:hover': { bgcolor: '#FEF2F2' } }}>
                                            <Trash size={20} variant="Bulk" color="#EF4444" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: '1px solid #F1F5F9',
                        '& .MuiTablePagination-toolbar': { fontFamily: 'var(--font-prompt)' },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontFamily: 'var(--font-prompt)', color: '#64748B' }
                    }}
                />
            </Paper>

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
                    sx={{ borderRadius: '12px', fontFamily: 'var(--font-prompt)', fontWeight: 600 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

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
                    <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'var(--font-prompt)', mb: 1 }}>
                        ยืนยันการลบข้อมูลพนักงาน?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-prompt)', mb: 3 }}>
                        คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ <strong>{staffToDelete?.th_firstname} {staffToDelete?.th_lastname}</strong>? การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center', gap: 2 }}>
                    <Button
                        disabled={deleteLoading}
                        onClick={() => setDeleteConfirmOpen(false)}
                        sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B', fontWeight: 600, flex: 1, borderRadius: '12px' }}
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        disabled={deleteLoading}
                        onClick={executeDelete}
                        variant="contained"
                        sx={{
                            fontFamily: 'var(--font-prompt)', bgcolor: '#EF4444', fontWeight: 700, flex: 1, borderRadius: '12px',
                            '&:hover': { bgcolor: '#DC2626' }
                        }}
                    >
                        {deleteLoading ? <CircularProgress size={20} color="inherit" /> : 'ยืนยันการลบ'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Hidden Badge for Download */}
            {selectedStaffForBadge && (
                <Box sx={{ position: 'fixed', top: -2000, left: -2000, zIndex: -1000 }}>
                    <Box
                        ref={badgeRef}
                        sx={{
                            width: 650,
                            height: 1016,
                            position: 'relative',
                            borderRadius: '32px', // Scaled border radius
                            overflow: 'hidden',
                            bgcolor: '#FFF',
                            display: 'flex',
                            flexDirection: 'column',
                            border: '1px solid #E2E8F0'
                        }}
                    >
                        {/* 1. Header Section (Scaled height) */}
                        <Box sx={{
                            width: '100%',
                            height: 136,
                            mt: 1,
                            backgroundImage: 'url(/api/uploads/card/card_header.png)',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            bgcolor: '#FFF',
                            flexShrink: 0,
                            borderBottom: '1px solid #F1F5F9'
                        }} />

                        {/* 2. Middle Photo Section (Scaled height) */}
                        <Box sx={{
                            width: '100%',
                            height: 644,
                            position: 'relative',
                            overflow: 'hidden',
                            bgcolor: '#F1F5F9',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {selectedStaffForBadge.file ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        backgroundImage: `url(${selectedStaffForBadge.file.startsWith('data:') ? selectedStaffForBadge.file : `/api/uploads/${selectedStaffForBadge.file}?v=${selectedStaffForBadge.updated_at ? new Date(selectedStaffForBadge.updated_at).getTime() : Date.now()}`})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: '#fff'
                                    }}
                                />
                            ) : (
                                <UserSquare size={220} color="#CBD5E1" variant="Bulk" />
                            )}
                        </Box>

                        {/* 3. Footer Section (Scaled height) */}
                        <Box sx={{
                            width: '100%',
                            height: 236,
                            backgroundImage: 'url(/api/uploads/card/card_footer.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            flexShrink: 0,
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            pl: 5,
                            pr: 0
                        }}>
                            <Box sx={{ flex: 1, color: '#FFF' }}>
                                <Typography sx={{
                                    fontWeight: 600,
                                    fontSize: `${(selectedStaffForBadge.name_font_size || 1.4) * 1.857}rem`,
                                    fontFamily: "'Prompt', sans-serif",
                                    lineHeight: 1.2,
                                    mb: 1.5,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'visible',
                                }}>
                                    {selectedStaffForBadge.th_firstname} {selectedStaffForBadge.th_lastname}
                                </Typography>
                                <Typography sx={{
                                    fontWeight: 600,
                                    fontSize: `${(selectedStaffForBadge.en_name_font_size || 1.0) * 1.857}rem`,
                                    fontFamily: "'Prompt', sans-serif",
                                    textTransform: 'uppercase',
                                    lineHeight: 1.1,
                                    mb: 1.5,
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {selectedStaffForBadge.en_firstname} {selectedStaffForBadge.en_lastname}
                                </Typography>
                                <Typography sx={{
                                    fontWeight: 600,
                                    fontSize: `${(selectedStaffForBadge.id_font_size || 1.4) * 1.857}rem`,
                                    fontFamily: '"Roboto", sans-serif',
                                    letterSpacing: '2px',
                                    lineHeight: 1.2
                                }}>
                                    {selectedStaffForBadge.emp_id || ''}
                                </Typography>
                            </Box>
                            <Box sx={{
                                width: 236,
                                height: 236,
                                bgcolor: '#FFF',
                                p: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {(() => {
                                    const vCard = `BEGIN:VCARD\nVERSION:3.0\nN:${selectedStaffForBadge.en_lastname || ''};${selectedStaffForBadge.en_firstname || ''}\nFN:${selectedStaffForBadge.en_firstname || ''} ${selectedStaffForBadge.en_lastname || ''}\nORG:${selectedStaffForBadge.company || 'SNNP'}\nTITLE:${selectedStaffForBadge.emp_id || ''}\nURL:${selectedStaffForBadge.website || 'snnp.co.th'}\nEND:VCARD`;
                                    const encodedVCard = encodeURIComponent(vCard);
                                    return (
                                        <Box
                                            component="img"
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedVCard}`}
                                            sx={{ width: '100%', height: '100%' }}
                                        />
                                    );
                                })()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
