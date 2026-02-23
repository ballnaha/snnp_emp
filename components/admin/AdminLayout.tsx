"use client";
import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const DRAWER_WIDTH = 260;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        // Desktop toggle
        setSidebarOpen(!sidebarOpen);
    };

    const handleMobileDrawerToggle = () => {
        // Mobile toggle
        setMobileOpen(!mobileOpen);
    };

    const currentDrawerWidth = sidebarOpen ? DRAWER_WIDTH : 0;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
            <CssBaseline />

            <AdminHeader
                drawerWidth={currentDrawerWidth}
                handleDrawerToggle={() => {
                    if (window.innerWidth < 900) {
                        handleMobileDrawerToggle();
                    } else {
                        handleDrawerToggle();
                    }
                }}
            />

            <AdminSidebar
                drawerWidth={DRAWER_WIDTH}
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleMobileDrawerToggle}
                isOpen={sidebarOpen}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 4 },
                    transition: theme => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar sx={{ mb: { xs: 0, md: 1 } }} /> {/* Spacer taking up AppBar height */}
                {children}
            </Box>
        </Box>
    );
}
