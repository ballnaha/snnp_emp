"use client";

import { SessionProvider } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/th';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
                {children}
            </LocalizationProvider>
        </SessionProvider>
    );
}
