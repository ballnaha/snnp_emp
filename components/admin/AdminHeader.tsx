"use client";
import React, { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography, Box, InputBase, Avatar, Badge, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { HambergerMenu, SearchNormal, MessageText, NotificationBing, ArrowDown2, Logout, Setting2, UserSquare } from 'iconsax-react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
    drawerWidth: number;
    handleDrawerToggle: () => void;
    isMobile?: boolean;
}

export default function AdminHeader({ drawerWidth, handleDrawerToggle }: AdminHeaderProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        signOut({ callbackUrl: '/login' });
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                backgroundColor: '#ffffff',
                color: '#1A1C2D',
                boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
                zIndex: theme => theme.zIndex.drawer + 1,
                transition: theme => theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            }}
        >
            <Toolbar sx={{ py: 1.2, px: { xs: 2, md: 4 } }}>
                <IconButton
                    aria-label="toggle drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{
                        mr: 2,
                        backgroundColor: '#ffffff',
                        border: '1px solid #F0F0F0',
                        borderRadius: '10px',
                        width: 40,
                        height: 40,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#F4F7FF',
                            borderColor: '#DBEAFE',
                            transform: 'scale(1.05)',
                        },
                        '&:active': {
                            transform: 'scale(0.95)',
                        }
                    }}
                >
                    <HambergerMenu size="22" variant="Bulk" color="#3B82F6" />
                </IconButton>

                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#1A1C2D',
                            display: { xs: 'none', sm: 'block' },
                            letterSpacing: '-0.5px',
                            fontFamily: 'var(--font-sarabun)'
                        }}
                    >
                        ยินดีต้อนรับ, {session?.user?.name || 'User'} 👋
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>


                    <Box sx={{ height: 28, width: '1px', backgroundColor: '#E4E7EB', display: { xs: 'none', sm: 'block' } }} />

                    {/* Profile Dropdown Trigger */}
                    <Box
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            p: 0.5,
                            borderRadius: '12px',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#F8FAFC' }
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#3B82F6', fontSize: '1rem', fontWeight: 600 }}>
                            {session?.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1A1C2D', fontFamily: 'var(--font-sarabun)', lineHeight: 1.2 }}>
                                {session?.user?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#8A8C9E', fontFamily: 'var(--font-sarabun)', display: 'block' }}>
                                {(session?.user as any)?.role || 'Member'}
                            </Typography>
                        </Box>
                        <ArrowDown2 size="16" color="#8A8C9E" variant={open ? "Bold" : "Linear"} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
                    </Box>

                    {/* Dropdown Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
                                mt: 1.5,
                                borderRadius: '12px',
                                minWidth: 180,
                                p: 1,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={() => { handleClose(); router.push('/admin/profile'); }} sx={{ borderRadius: '8px', py: 1, mb: 0.5 }}>
                            <ListItemIcon>
                                <UserSquare size="20" color="#3B82F6" />
                            </ListItemIcon>
                            <Typography sx={{ fontFamily: 'var(--font-sarabun)', fontWeight: 500, fontSize: '0.9rem' }}>โปรไฟล์</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose} sx={{ borderRadius: '8px', py: 1, mb: 0.5 }}>
                            <ListItemIcon>
                                <Setting2 size="20" color="#8A8C9E" />
                            </ListItemIcon>
                            <Typography sx={{ fontFamily: 'var(--font-sarabun)', fontWeight: 500, fontSize: '0.9rem' }}>ตั้งค่า</Typography>
                        </MenuItem>
                        <Divider sx={{ my: 1, opacity: 0.5 }} />
                        <MenuItem onClick={handleLogout} sx={{ borderRadius: '8px', py: 1, color: '#EF4444' }}>
                            <ListItemIcon>
                                <Logout size="20" color="#EF4444" />
                            </ListItemIcon>
                            <Typography sx={{ fontFamily: 'var(--font-sarabun)', fontWeight: 600, fontSize: '0.9rem' }}>ออกจากระบบ</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

