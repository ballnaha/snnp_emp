"use client";
import React from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import {
    Grid5, Box as BoxIcon, Shop, MessageText, Chart21, ReceiptItem, TaskSquare, DollarCircle,
    InfoCircle, Setting2, Logout, ArrowLeft2, Category, UserSquare, Personalcard, People
} from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface AdminSidebarProps {
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
    isOpen: boolean;
}

const mainMenuItems = [
    { text: 'Dashboard', icon: <Grid5 />, path: '/admin', color: '#3B82F6' },
    { text: 'Employees', icon: <Personalcard />, path: '/admin/staff', color: '#10B981' },
];

const helpMenuItems = [
    { text: 'Users', icon: <UserSquare />, path: '/admin/users', color: '#10B981' },
];

export default function AdminSidebar({ drawerWidth, mobileOpen, handleDrawerToggle, isOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1A1C29', color: '#8A8C9E' }}>
            {/* Logo Area */}
            <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ p: 0.8, bgcolor: 'transparent', border: '1px solid #ffffff', borderRadius: '8px', color: '#ffffff', display: 'flex' }}>
                    <Category size={18} variant="Bold" color="#ffffff" />
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1.2rem', letterSpacing: '0.5px', lineHeight: 1 }}>
                        DASHBOARD
                    </Typography>
                </Box>
            </Box>


            {/* Menu Sections */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
                <Typography variant="caption" sx={{ px: 2, py: 1.5, display: 'block', fontWeight: 600, letterSpacing: '1px', fontSize: '0.7rem' }}>
                    MAIN MENU
                </Typography>
                <List sx={{ pb: 1, pt: 0 }}>
                    {mainMenuItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.path}
                                    onClick={() => mobileOpen && handleDrawerToggle()}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                                        color: isActive ? '#ffffff' : '#8A8C9E',
                                        py: 1.2,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                            color: '#ffffff',
                                        },
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {isActive && (
                                        <Box sx={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '4px', bgcolor: '#ffffff', borderRadius: '0 4px 4px 0' }} />
                                    )}
                                    <ListItemIcon sx={{ color: isActive ? '#ffffff' : item.color, minWidth: '40px' }}>
                                        {React.cloneElement(item.icon as React.ReactElement<any>, {
                                            variant: isActive ? 'Bold' : 'Linear',
                                            size: 20,
                                            color: isActive ? '#ffffff' : item.color
                                        })}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} slotProps={{ primary: { fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' } }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Typography variant="caption" sx={{ px: 2, py: 1.5, display: 'block', fontWeight: 600, letterSpacing: '1px', fontSize: '0.7rem' }}>
                    SETTINGS
                </Typography>
                <List sx={{ pb: 2, pt: 0 }}>
                    {helpMenuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.path}
                                    onClick={() => mobileOpen && handleDrawerToggle()}
                                    sx={{
                                        borderRadius: '12px',
                                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                                        color: isActive ? '#ffffff' : '#8A8C9E',
                                        py: 1.2,
                                        px: 2,
                                        '&:hover': {
                                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                            color: '#ffffff',
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? '#ffffff' : item.color, minWidth: '40px' }}>
                                        {React.cloneElement(item.icon as React.ReactElement<any>, {
                                            variant: isActive ? 'Bold' : 'Linear',
                                            size: 20,
                                            color: isActive ? '#ffffff' : item.color
                                        })}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} slotProps={{ primary: { fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' } }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Log Out */}
            <Box sx={{ px: 2, pb: 3, pt: 1 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        sx={{ borderRadius: '12px', color: '#8A8C9E', px: 2, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)', color: '#ffffff' } }}
                    >
                        <ListItemIcon sx={{ color: "inherit", minWidth: '40px' }}>
                            <Logout size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" slotProps={{ primary: { fontWeight: 500, fontSize: '0.9rem' } }} />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { md: isOpen ? drawerWidth : 0 },
                flexShrink: { md: 0 },
                transition: theme => theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: 'none',
                        backgroundColor: '#1A1C29',
                        boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: 'none',
                        backgroundColor: '#1A1C29',
                        transform: isOpen ? 'none' : `translateX(-${drawerWidth}px)`,
                        visibility: isOpen ? 'visible' : 'hidden',
                        transition: theme => theme.transitions.create(['transform', 'visibility'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
                open={isOpen}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
}
