"use client";
import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Avatar,
    IconButton, Chip, LinearProgress, Stack, Button, CircularProgress,
    Fade, Zoom
} from '@mui/material';
import {
    ArrowDown2, UserAdd, Setting2,
    More, Clock, Profile2User, Hierarchy, Profile,
    Activity, Magicpen, SecurityUser, TrendUp, ElementPlus
} from 'iconsax-react';
import { useRouter } from 'next/navigation';

interface DashboardActivity {
    id: string;
    action: string;
    user: string;
    time: string;
    color: string;
    image?: string | null;
}

interface User {
    name?: string;
    username?: string;
    role: string;
}

interface DashboardData {
    totalEmployees: number;
    totalUsers: number;
    newEmployeesThisMonth: number;
    activities: DashboardActivity[];
    user: User;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/dashboard');
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress size={48} sx={{ color: '#0F172A' }} />
            </Box>
        );
    }

    const stats = [
        {
            title: 'พนักงานทั้งหมด',
            value: data?.totalEmployees || 0,
            trend: '+12% จากเดือนที่แล้ว',
            isPositive: true,
            icon: <Profile2User size={28} color="#4F46E5" variant="Bulk" />,
            iconBg: '#EEF2FF',
            color: '#4F46E5'
        },
        {
            title: 'พนักงานเข้าใหม่ (เดือนนี้)',
            value: data?.newEmployeesThisMonth || 0,
            trend: 'พนักงานเพิ่มใหม่',
            isPositive: true,
            icon: <UserAdd size={28} color="#0EA5E9" variant="Bulk" />,
            iconBg: '#F0F9FF',
            color: '#0EA5E9'
        },
        {
            title: 'ผู้ดูแลระบบ',
            value: data?.totalUsers || 0,
            trend: 'บัญชีระบบหลังบ้าน',
            isPositive: true,
            icon: <SecurityUser size={28} color="#8B5CF6" variant="Bulk" />,
            iconBg: '#F5F3FF',
            color: '#8B5CF6'
        },
        {
            title: 'ความเสถียรระบบ',
            value: '100%',
            trend: 'สถานะออนไลน์ปกติ',
            isPositive: true,
            icon: <Activity size={28} color="#10B981" variant="Bulk" />,
            iconBg: '#ECFDF5',
            color: '#10B981'
        },
    ];

    const recentActivities = data?.activities || [];
    const currentUser = data?.user || { name: 'Admin User', role: 'admin' };

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ pb: 6, pt: 1, px: { xs: 1, sm: 2, md: 0 } }}>
                {/* Header Section - Modern Minimalist */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 5,
                    flexWrap: 'wrap',
                    gap: 3
                }}>
                    <Box>
                        <Typography variant="h3" sx={{
                            fontWeight: 800,
                            color: '#0F172A',
                            mb: 1,
                            letterSpacing: '-1px',
                            fontFamily: 'var(--font-prompt)',
                            display: 'flex', alignItems: 'center', gap: 1.5
                        }}>
                            Dashboard Overview
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'var(--font-prompt)' }}>
                            Welcome back, <Box component="span" sx={{ color: '#0F172A', fontWeight: 700 }}>{currentUser?.name}</Box>. Here is what's happening today.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<ElementPlus size={20} variant="Bold" color="white" />}
                        onClick={() => router.push('/admin/staff/new')}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            px: 3,
                            py: 1.2,
                            background: '#0F172A',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-prompt)',
                            boxShadow: '0 4px 14px 0 rgba(15, 23, 42, 0.2)',
                            '&:hover': {
                                background: '#1E293B',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.25)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        เพิ่มพนักงานใหม่
                    </Button>
                </Box>

                {/* 4 Cards in a Row using Box Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: 3,
                    mb: 5
                }}>
                    {stats.map((stat, index) => (
                        <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={index}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '20px',
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)',
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    '&:hover': {
                                        borderColor: '#CBD5E1',
                                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: '24px !important', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                        <Box
                                            sx={{
                                                width: 52, height: 52, borderRadius: '14px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: stat.iconBg,
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, background: '#F8FAFC', p: 0.75, borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                                            {stat.isPositive ?
                                                <TrendUp size={14} color={stat.color} variant="Bold" /> :
                                                <ArrowDown2 size={14} color="#EF4444" variant="Bold" />
                                            }
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-prompt)' }}>
                                                {stat.trend}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-prompt)', lineHeight: 1, mb: 1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600, fontFamily: 'var(--font-prompt)' }}>
                                            {stat.title}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Zoom>
                    ))}
                </Box>

                {/* Bottom Section using Box Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' },
                    gap: 4
                }}>
                    {/* Left Column: Recent Activity & System Status */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Card elevation={0} sx={{
                            borderRadius: '24px', border: '1px solid #E2E8F0',
                            flexGrow: 1, display: 'flex', flexDirection: 'column',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                        }}>
                            <Box sx={{ p: 3, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-prompt)' }}>
                                    ความเคลื่อนไหวล่าสุด (Recent Activities)
                                </Typography>
                                <IconButton size="small" sx={{ color: '#64748B', bgcolor: '#F8FAFC', '&:hover': { bgcolor: '#F1F5F9' } }}>
                                    <More size={20} />
                                </IconButton>
                            </Box>

                            <CardContent sx={{ p: 4, pt: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Activity List */}
                                <Box sx={{ flexGrow: 1 }}>
                                    {recentActivities.length > 0 ? (
                                        <Stack spacing={3}>
                                            {recentActivities.map((item, idx) => (
                                                <Box key={item.id} sx={{
                                                    display: 'flex', alignItems: 'flex-start', gap: 2.5,
                                                    pb: idx !== recentActivities.length - 1 ? 3 : 0,
                                                    borderBottom: idx !== recentActivities.length - 1 ? '1px dashed #E2E8F0' : 'none'
                                                }}>
                                                    <Box sx={{ position: 'relative' }}>
                                                        <Avatar
                                                            src={item.image ? `/api/uploads/${item.image}` : undefined}
                                                            sx={{
                                                                width: 46, height: 46,
                                                                bgcolor: `${item.color}15`, color: item.color,
                                                                fontWeight: 700, borderRadius: '14px',
                                                                border: item.image ? '1px solid #E2E8F0' : 'none'
                                                            }}
                                                        >
                                                            {!item.image && item.user.charAt(0)}
                                                        </Avatar>
                                                    </Box>
                                                    <Box sx={{ flexGrow: 1, pt: 0.5 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-prompt)', fontSize: '1rem' }}>
                                                                    {item.user}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, mt: 0.5, fontFamily: 'var(--font-prompt)' }}>
                                                                    <Box component="span" sx={{ color: '#0F172A', fontWeight: 600 }}>{item.action}</Box> ผ่านระบบจัดการใหม่
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94A3B8', bgcolor: '#F8FAFC', px: 1.5, py: 0.5, borderRadius: '20px' }}>
                                                                <Clock size={14} variant="Bold" />
                                                                <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'var(--font-prompt)' }}>
                                                                    {item.time}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Box sx={{ textAlign: 'center', py: 6 }}>
                                            <Profile2User size={48} color="#CBD5E1" variant="Bulk" style={{ margin: '0 auto', opacity: 0.5 }} />
                                            <Typography variant="body1" sx={{ color: '#94A3B8', fontFamily: 'var(--font-prompt)', mt: 2, fontWeight: 600 }}>
                                                ไม่มีประวัติการเพิ่มพนักงานใหม่ ในขณะนี้
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* System Status Bar */}
                                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #F1F5F9' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569', fontFamily: 'var(--font-prompt)' }}>
                                            Database Status
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-prompt)' }}>
                                            Healthy
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={100}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            backgroundColor: '#F1F5F9',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 4,
                                                background: '#10B981'
                                            }
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Right Column: Profile & Quick Links */}
                    <Box>
                        <Stack spacing={4} sx={{ height: '100%' }}>
                            {/* Premium Profile Card */}
                            <Card elevation={0} sx={{
                                borderRadius: '24px',
                                background: 'linear-gradient(135deg, #4338CA 0%, #7C3AED 100%)',
                                color: '#FFFFFF',
                                position: 'relative', overflow: 'hidden',
                                boxShadow: '0 15px 35px -5px rgba(124, 58, 237, 0.4)'
                            }}>
                                <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
                                    <Magicpen size={200} variant="Bulk" color="#FFFFFF" />
                                </Box>
                                <CardContent sx={{ p: 4, pt: 5, pb: 5, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 80, height: 80, mx: 'auto', mb: 2,
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            bgcolor: '#2E1065', // Darker purple for contrast
                                            fontSize: '2rem', fontWeight: 800, color: '#FFF'
                                        }}
                                    >
                                        {(currentUser?.name || currentUser?.username || 'U').charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'var(--font-prompt)', letterSpacing: '-0.5px', mb: 0.5 }}>
                                        {currentUser?.name || currentUser?.username || 'ผู้ใช้งาน'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500, mb: 3, fontFamily: 'var(--font-prompt)' }}>
                                        Manage your system & employees
                                    </Typography>
                                    <Chip
                                        // @ts-ignore
                                        label={currentUser?.role === 'admin' ? "Administrator" : "User Role"}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.1)', color: '#FFFFFF',
                                            fontWeight: 700, px: 1.5, py: 1.5, borderRadius: '8px', fontFamily: 'var(--font-prompt)',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    />
                                </CardContent>
                            </Card>

                            {/* Quick Actions List */}
                            <Card elevation={0} sx={{ borderRadius: '24px', border: '1px solid #E2E8F0', flexGrow: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                                <Box sx={{ p: 3, px: 4, borderBottom: '1px solid #F1F5F9' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-prompt)' }}>
                                        Quick Actions
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2 }}>
                                    <Stack spacing={1}>
                                        {[
                                            { title: 'เพิ่มพนักงานใหม่', desc: 'สร้างประวัติพนักงานเข้าสู่ระบบ', path: '/admin/staff/new', icon: <UserAdd size={22} variant="Bulk" color="#4F46E5" />, color: '#4F46E5', bg: '#EEF2FF' },
                                            { title: 'จัดการฐานข้อมูล', desc: 'ค้นหาและแก้ไขข้อมูลที่มีอยู่', path: '/admin/staff', icon: <Profile size={22} variant="Bulk" color="#10B981" />, color: '#10B981', bg: '#ECFDF5' },
                                            { title: 'จัดการผู้ใช้งาน', desc: 'ตั้งค่าสิทธิ์บัญชี Admin', path: '/admin/users', icon: <Setting2 size={22} variant="Bulk" color="#8B5CF6" />, color: '#8B5CF6', bg: '#F5F3FF' }
                                        ].map((action, idx) => (
                                            <Box key={idx} onClick={() => router.push(action.path)} sx={{
                                                p: 2, borderRadius: '16px',
                                                display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': { bgcolor: '#F8FAFC' }
                                            }}>
                                                <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: action.bg, color: action.color, display: 'flex' }}>
                                                    {action.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-prompt)' }}>{action.title}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, fontFamily: 'var(--font-prompt)' }}>{action.desc}</Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Card>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </Fade>
    );
}
