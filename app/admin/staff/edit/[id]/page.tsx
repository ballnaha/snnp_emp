"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    Stack,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Divider,
    InputAdornment,
    Slider,
    Grid
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import {
    Edit2,
    ArrowLeft,
    Camera,
    Trash,
    UserSquare,
    Save2,
    Personalcard,
    Hierarchy,
    Buildings,
    CalendarTick,
    DirectboxSend,
    Global,
    InfoCircle,
    Profile,
    Card,
    DocumentDownload
} from 'iconsax-react';
import ImageCropper from '@/components/admin/ImageCropper';
import html2canvas from 'html2canvas';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/th';

export default function EditStaffPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    // States
    const [formData, setFormData] = useState({
        th_firstname: '',
        th_lastname: '',
        en_firstname: '',
        en_lastname: '',
        emp_id: '',
        start_date: null as Dayjs | null,
        department: '',
        section: '',
        emp_card_id: '',
        email: '',
        website: 'snnp.co.th',
        company: 'SNNP',
        file: null as string | null
    });

    const [nameFontSize, setNameFontSize] = useState(1.4); // Default 1.4rem
    const [enNameFontSize, setEnNameFontSize] = useState(1.0); // Default 1.0rem
    const [idFontSize, setIdFontSize] = useState(1.4); // Default 1.4rem

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Cropper States
    const [cropperOpen, setCropperOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch(`/api/staff/${id}`);
                if (res.ok) {
                    const staff = await res.json();
                    if (staff) {
                        setFormData({
                            ...staff,
                            emp_id: staff.emp_id?.toString() || '',
                            start_date: staff.start_date ? dayjs(staff.start_date) : null,
                            file: staff.file ? `/api/uploads/${staff.file}?v=${staff.updated_at ? new Date(staff.updated_at).getTime() : Date.now()}` : null
                        });
                        if (staff.name_font_size) setNameFontSize(staff.name_font_size);
                        if (staff.en_name_font_size) setEnNameFontSize(staff.en_name_font_size);
                        if (staff.id_font_size) setIdFontSize(staff.id_font_size);
                    } else {
                        setSnackbar({ open: true, message: 'ไม่พบข้อมูลพนักงาน', severity: 'error' });
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchStaff();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (newValue: Dayjs | null) => {
        setFormData(prev => ({ ...prev, start_date: newValue }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result as string);
                setCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: string) => {
        setFormData(prev => ({ ...prev, file: croppedImage }));
        setCropperOpen(false);
        setTempImage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/staff/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    start_date: formData.start_date ? formData.start_date.toISOString() : null,
                    name_font_size: nameFontSize,
                    en_name_font_size: enNameFontSize,
                    id_font_size: idFontSize
                }),
            });

            if (res.ok) {
                setSnackbar({
                    open: true,
                    message: 'อัปเดตข้อมูลพนักงานเรียบร้อยแล้ว',
                    severity: 'success'
                });
                setTimeout(() => router.push('/admin/staff'), 1500);
            } else {
                const error = await res.text();
                setSnackbar({
                    open: true,
                    message: error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
                    severity: 'error'
                });
            }
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        if (!badgeRef.current) return;

        try {
            const canvas = await html2canvas(badgeRef.current, {
                useCORS: true,
                scale: 2, // Higher quality
                backgroundColor: null
            });

            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `badge_${formData.emp_id}_${formData.en_firstname}.png`;
            link.href = image;
            link.click();

            setSnackbar({
                open: true,
                message: 'ดาวน์โหลดรูปบัตรเรียบร้อยแล้ว',
                severity: 'success'
            });
        } catch (err) {
            console.error(err);
            setSnackbar({
                open: true,
                message: 'เกิดข้อผิดพลาดในการดาวน์โหลดรูป',
                severity: 'error'
            });
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Box sx={{
                            p: 1.2,
                            borderRadius: '14px',
                            bgcolor: '#EEF2FF',
                            display: 'flex',
                            color: '#6366F1'
                        }}>
                            <Edit2 variant="Bold" size={24} color="#6366F1" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-sarabun)', color: '#1E293B' }}>
                            แก้ไขข้อมูลพนักงาน
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'var(--font-sarabun)', ml: 6.5 }}>
                        อัปเดตโปรไฟล์พนักงานและตรวจสอบความถูกต้องของบัตร
                    </Typography>
                </Box>
                <Button
                    variant="text"
                    startIcon={<ArrowLeft size={20} variant="Bold" />}
                    onClick={() => router.back()}
                    sx={{
                        borderRadius: '10px',
                        color: '#64748B',
                        fontFamily: 'var(--font-sarabun)',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.85rem',
                        '&:hover': { bgcolor: '#F1F5F9', color: '#1E293B' }
                    }}
                >
                    ย้อนกลับ
                </Button>
            </Box>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>

                    {/* Left Panel: Profile Photo */}
                    <Box sx={{ width: { xs: '100%', lg: '320px' } }}>
                        <Paper sx={{
                            p: 4,
                            borderRadius: '24px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)',
                            textAlign: 'center',
                            position: 'sticky',
                            top: 24
                        }}>
                            <Typography variant="subtitle2" sx={{
                                fontWeight: 700,
                                fontFamily: 'var(--font-sarabun)',
                                color: '#1E293B',
                                mb: 3,
                                textAlign: 'left',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Camera size={20} color="#6366F1" variant="Bold" /> รูปโปรไฟล์
                            </Typography>

                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                <Avatar
                                    src={formData.file || ''}
                                    variant="rounded"
                                    sx={{
                                        width: 220,
                                        height: 218, // ปรับจาก 264 ให้ตรงสัดส่วน (350:347)
                                        borderRadius: '24px',
                                        bgcolor: '#F8FAFC',
                                        border: '2px dashed #E2E8F0',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { borderColor: '#6366F1', bgcolor: '#F5F7FF' }
                                    }}
                                >
                                    {!formData.file && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <UserSquare size={64} color="#CBD5E1" variant="Bulk" />
                                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#94A3B8', fontFamily: 'var(--font-sarabun)' }}>
                                                คลิกเพื่ออัปโหลด
                                            </Typography>
                                        </Box>
                                    )}
                                </Avatar>

                                <Box sx={{
                                    position: 'absolute',
                                    bottom: -20,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    gap: 1.5
                                }}>
                                    <IconButton
                                        onClick={() => fileInputRef.current?.click()}
                                        sx={{
                                            bgcolor: '#6366F1',
                                            color: 'white',
                                            width: 44,
                                            height: 44,
                                            '&:hover': { bgcolor: '#4F46E5', transform: 'scale(1.1)' },
                                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Camera size={20} variant="Bold" color="#fff" />
                                    </IconButton>
                                    {formData.file && (
                                        <IconButton
                                            onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                                            sx={{
                                                bgcolor: '#FFF',
                                                color: '#EF4444',
                                                width: 44,
                                                height: 44,
                                                border: '1px solid #FEE2E2',
                                                '&:hover': { bgcolor: '#FEF2F2', transform: 'scale(1.1)' },
                                                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.1)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Trash size={20} variant="Bold" color="#EF4444" />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                onClick={(e) => (e.target as any).value = null}
                            />

                            <Box sx={{ mt: 4, textAlign: 'left', p: 2, bgcolor: '#F8FAFC', borderRadius: '16px' }}>
                                <Typography variant="caption" sx={{
                                    display: 'flex',
                                    gap: 1,
                                    color: '#64748B',
                                    fontFamily: 'var(--font-sarabun)',
                                    lineHeight: 1.5
                                }}>
                                    <InfoCircle size={14} variant="Bold" color="#6366F1" />
                                    รูปภาพจะถูกปรับขนาดให้เหมาะสมสำหรับบัตรพนักงานโดยอัตโนมัติ (600x720px)
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right Panel: Form Content */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{
                            p: { xs: 3, md: 5 },
                            borderRadius: '24px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)'
                        }}>

                            {/* Section 1: Personal Information */}
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-sarabun)',
                                    color: '#1E293B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 3
                                }}>
                                    <Profile size={26} color="#3B82F6" variant="Bulk" /> ข้อมูลส่วนตัว
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            ชื่อ (ภาษาไทย)
                                        </Typography>
                                        <TextField
                                            name="th_firstname"
                                            fullWidth
                                            required
                                            value={formData.th_firstname}
                                            onChange={handleChange}
                                            placeholder="ภาษาไทย"
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { borderColor: '#E2E8F0' } } }}
                                        />
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            นามสกุล (ภาษาไทย)
                                        </Typography>
                                        <TextField
                                            name="th_lastname"
                                            fullWidth
                                            required
                                            value={formData.th_lastname}
                                            onChange={handleChange}
                                            placeholder="ภาษาไทย"
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { borderColor: '#E2E8F0' } } }}
                                        />
                                    </Box>

                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            First Name (English)
                                        </Typography>
                                        <TextField
                                            name="en_firstname"
                                            fullWidth
                                            required
                                            value={formData.en_firstname}
                                            onChange={handleChange}
                                            placeholder="English Name"
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { borderColor: '#E2E8F0' } } }}
                                        />
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            Last Name (English)
                                        </Typography>
                                        <TextField
                                            name="en_lastname"
                                            fullWidth
                                            required
                                            value={formData.en_lastname}
                                            onChange={handleChange}
                                            placeholder="English Last Name"
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { borderColor: '#E2E8F0' } } }}
                                        />
                                    </Box>

                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            เลขที่บัตรประชาชน
                                        </Typography>
                                        <TextField
                                            name="emp_card_id"
                                            fullWidth
                                            value={formData.emp_card_id || ''}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC', border: 'none', '& fieldset': { borderColor: '#E2E8F0' } } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Personalcard size={20} color="#64748B" variant="TwoTone" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 6, borderStyle: 'dashed' }} />

                            {/* Section 2: Work Information */}
                            <Box sx={{ mb: 6 }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-sarabun)',
                                    color: '#1E293B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 3
                                }}>
                                    <Buildings size={26} color="#F59E0B" variant="Bulk" /> ข้อมูลการทำงาน
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            รหัสพนักงาน <span style={{ color: '#EF4444' }}>*</span>
                                        </Typography>
                                        <TextField
                                            name="emp_id"
                                            fullWidth
                                            required
                                            value={formData.emp_id}
                                            onChange={handleChange}
                                            placeholder="เช่น 10001"
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                        />
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            วันที่เริ่มงาน
                                        </Typography>
                                        <DatePicker
                                            value={formData.start_date}
                                            onChange={handleDateChange}
                                            format="DD/MM/YYYY"
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    sx: { '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } },
                                                    InputProps: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CalendarTick size={20} color="#64748B" variant="TwoTone" />
                                                            </InputAdornment>
                                                        ),
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            ฝ่าย
                                        </Typography>
                                        <TextField
                                            name="department"
                                            fullWidth
                                            value={formData.department}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Hierarchy size={20} color="#64748B" variant="TwoTone" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            แผนก
                                        </Typography>
                                        <TextField
                                            name="section"
                                            fullWidth
                                            value={formData.section}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                        />
                                    </Box>

                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            บริษัท
                                        </Typography>
                                        <TextField
                                            name="company"
                                            fullWidth
                                            value={formData.company}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 6, borderStyle: 'dashed' }} />

                            {/* Section 3: Contact Information */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 800,
                                    fontFamily: 'var(--font-sarabun)',
                                    color: '#1E293B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    mb: 3
                                }}>
                                    <DirectboxSend size={26} color="#10B981" variant="Bulk" /> ข้อมูลติดต่อ
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            Email พนักงาน
                                        </Typography>
                                        <TextField
                                            name="email"
                                            type="email"
                                            fullWidth
                                            value={formData.email}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                        />
                                    </Box>
                                    <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'var(--font-sarabun)', color: '#475569', mb: 1, ml: 1 }}>
                                            Website บริษัท
                                        </Typography>
                                        <TextField
                                            name="website"
                                            fullWidth
                                            value={formData.website}
                                            onChange={handleChange}
                                            sx={{ '& .MuiInputBase-root': { borderRadius: '14px', bgcolor: '#F8FAFC' } }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Global size={20} color="#64748B" variant="TwoTone" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Badge Preview Section */}
                        <Paper sx={{
                            mt: 4,
                            p: 4,
                            borderRadius: '24px',
                            border: '1px solid #F1F5F9',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03)',
                            background: 'linear-gradient(135deg, #FFF 0%, #FAFBFF 100%)'
                        }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 800,
                                fontFamily: 'var(--font-sarabun)',
                                color: '#1E293B',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 3
                            }}>
                                <Card size={26} color="#6366F1" variant="Bulk" /> ตัวอย่างบัตรพนักงาน
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4
                            }}>
                                <Box sx={{
                                    width: 350,
                                    height: 547,
                                    position: 'relative',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                                    bgcolor: '#FFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #E2E8F0'
                                }}
                                    ref={badgeRef}
                                >
                                    {/* 1. Header Section (1.3 cm) */}
                                    <Box sx={{
                                        width: '100%',
                                        height: 73,
                                        mt: 0.5,
                                        backgroundImage: 'url(/api/uploads/card/card_header.png)',
                                        backgroundSize: 'contain',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        bgcolor: '#FFF',
                                        flexShrink: 0,
                                        borderBottom: '1px solid #F1F5F9'
                                    }} />

                                    {/* 2. Middle Photo Section (Fixed height for better proportion) */}
                                    <Box sx={{
                                        width: '100%',
                                        height: 347, // (547 - 73 - 127)
                                        position: 'relative',
                                        overflow: 'hidden',
                                        bgcolor: '#F1F5F9',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {formData.file ? (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundImage: `url(${formData.file})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                        ) : (
                                            <UserSquare size={120} color="#CBD5E1" variant="Bulk" />
                                        )}
                                    </Box>

                                    {/* 3. Footer Section (2 cm) */}
                                    <Box sx={{
                                        width: '100%',
                                        height: 127,
                                        backgroundImage: 'url(/api/uploads/card/card_footer.png)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        flexShrink: 0,
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pl: 3,
                                        pr: 0
                                    }}>
                                        {/* Left Side: Employee Names and ID */}
                                        <Box sx={{ flex: 1, color: '#FFF' }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                fontSize: `${nameFontSize}rem`,
                                                fontFamily: "'Sarabun', sans-serif",
                                                lineHeight: 1.2,
                                                mb: 1,
                                                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'visible',
                                            }}>
                                                {formData.th_firstname} {formData.th_lastname}
                                            </Typography>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                fontSize: `${enNameFontSize}rem`,
                                                fontFamily: "'Sarabun', sans-serif",
                                                textTransform: 'uppercase',
                                                lineHeight: 1.1,
                                                mb: 1,
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {formData.en_firstname} {formData.en_lastname}
                                            </Typography>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                fontSize: `${idFontSize}rem`,
                                                fontFamily: '"Roboto", sans-serif',
                                                letterSpacing: '1px',
                                                lineHeight: 1.2
                                            }}>
                                                {formData.emp_id || ''}
                                            </Typography>
                                        </Box>

                                        {/* Right Side: QR Code Area */}
                                        <Box sx={{
                                            width: 127,
                                            height: 127,
                                            bgcolor: '#FFF',
                                            p: 0.5,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {(() => {
                                                const vCard = `BEGIN:VCARD\nVERSION:3.0\nN:${formData.en_lastname};${formData.en_firstname}\nFN:${formData.en_firstname} ${formData.en_lastname}\nORG:${formData.company}\nTITLE:${formData.emp_id}\nURL:${formData.website}\nEND:VCARD`;
                                                const encodedVCard = encodeURIComponent(vCard);
                                                return (
                                                    <Box
                                                        component="img"
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodedVCard}`}
                                                        sx={{ width: '100%', height: '100%' }}
                                                    />
                                                );
                                            })()}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Font Size Controls */}
                                <Box sx={{ mt: 3, maxWidth: 350, mx: 'auto' }}>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                ขนาดชื่อไทย ({nameFontSize}rem)
                                            </Typography>
                                            <Slider
                                                value={nameFontSize}
                                                min={0.8}
                                                max={2.0}
                                                step={0.05}
                                                onChange={(_, value) => setNameFontSize(value as number)}
                                                sx={{ color: '#6366F1', '& .MuiSlider-thumb': { width: 12, height: 12 } }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                ขนาดชื่ออังกฤษ ({enNameFontSize}rem)
                                            </Typography>
                                            <Slider
                                                value={enNameFontSize}
                                                min={0.6}
                                                max={1.5}
                                                step={0.05}
                                                onChange={(_, value) => setEnNameFontSize(value as number)}
                                                sx={{ color: '#6366F1', '& .MuiSlider-thumb': { width: 12, height: 12 } }}
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                ขนาดรหัสพนักงาน ({idFontSize}rem)
                                            </Typography>
                                            <Slider
                                                value={idFontSize}
                                                min={1.0}
                                                max={2.5}
                                                step={0.05}
                                                onChange={(_, value) => setIdFontSize(value as number)}
                                                sx={{ color: '#6366F1', '& .MuiSlider-thumb': { width: 12, height: 12 } }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>


                        {/* Submit Actions */}
                        <Box sx={{
                            mt: 4,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            p: 2
                        }}>
                            <Button
                                variant="text"
                                disabled={saving}
                                onClick={() => router.back()}
                                sx={{
                                    borderRadius: '10px',
                                    color: '#64748B',
                                    px: 3,
                                    py: 1,
                                    fontFamily: 'var(--font-sarabun)',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    '&:hover': { bgcolor: '#F1F5F9' }
                                }}
                            >
                                ยกเลิก
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save2 size={20} variant="Bold" color="#fff" />}
                                sx={{
                                    borderRadius: '12px',
                                    bgcolor: '#1E293B',
                                    px: 4,
                                    py: 1,
                                    fontFamily: 'var(--font-sarabun)',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    '&:hover': { bgcolor: '#0F172A', transform: 'translateY(-2px)' },
                                    boxShadow: '0 10px 20px -5px rgba(30, 41, 59, 0.3)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </form>

            <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                onClick={(e) => (e.target as any).value = null}
            />

            {cropperOpen && (
                <ImageCropper
                    open={cropperOpen}
                    image={tempImage!}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropperOpen(false)}
                />
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 600, fontFamily: 'var(--font-sarabun)' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
