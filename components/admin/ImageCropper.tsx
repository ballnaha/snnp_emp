"use client";

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    Typography,
    Box
} from '@mui/material';

interface ImageCropperProps {
    open: boolean;
    image: string;
    onClose: () => void;
    onCropComplete: (croppedImage: string) => void;
}

export default function ImageCropper({ open, image, onClose, onCropComplete }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number, y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async () => {
        try {
            const img = await createImage(image);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const base64Image = canvas.toDataURL('image/jpeg', 0.9);
            onCropComplete(base64Image);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontFamily: 'var(--font-prompt)', fontWeight: 700 }}>
                ปรับแต่งรูปภาพพนักงาน
            </DialogTitle>
            <DialogContent sx={{ height: 450, position: 'relative', bgcolor: '#000' }}>
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={350 / 347} // ปรับให้ตรงกับพื้นที่รูปในบัตร (350px / 347px)
                    onCropChange={onCropChange}
                    onCropComplete={onCropCompleteInternal}
                    onZoomChange={onZoomChange}
                />
            </DialogContent>
            <DialogActions sx={{ flexDirection: 'column', p: 3, gap: 2 }}>
                <Box sx={{ width: '100%', px: 2 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', mb: 1, display: 'block' }}>
                        Zoom
                    </Typography>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_e, val) => setZoom(val as number)}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} sx={{ fontFamily: 'var(--font-prompt)', color: '#64748B' }}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="contained"
                        onClick={getCroppedImg}
                        sx={{
                            fontFamily: 'var(--font-prompt)',
                            bgcolor: '#3B82F6',
                            borderRadius: '12px',
                            px: 4
                        }}
                    >
                        ตกลง
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
