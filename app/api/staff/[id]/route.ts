import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);

        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const staff = await prisma.employee.findUnique({
            where: { id }
        });

        if (!staff) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(staff);
    } catch (error) {
        console.error("[STAFF_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);

        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            th_firstname,
            th_lastname,
            en_firstname,
            en_lastname,
            emp_id,
            start_date,
            department,
            section,
            emp_card_id,
            email,
            website,
            company,
            file // base64
        } = body;

        // Get current employee data
        const currentStaff = await prisma.employee.findUnique({
            where: { id }
        });

        if (!currentStaff) {
            return new NextResponse("Not Found", { status: 404 });
        }

        let fileName = currentStaff.file;

        // If new file is uploaded
        if (file && file.startsWith('data:image')) {
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            // Delete old file if exists
            if (currentStaff.file) {
                const oldPath = path.join(uploadDir, currentStaff.file);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const base64Data = file.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            // Generate filename: รหัสพนักงาน_ชื่อพนักงาน
            // Use provided emp_id and en_firstname or fallback to current ones
            const finalEmpId = emp_id || currentStaff.emp_id;
            const finalName = en_firstname || currentStaff.en_firstname;
            fileName = `${finalEmpId}_${finalName}.jpg`;

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await sharp(buffer)
                .resize(1000, 991, { // ปรับให้ตรงกับสัดส่วนพื้นที่รูปในบัตร (350:347)
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toFile(path.join(uploadDir, fileName));
        }

        const updatedStaff = await prisma.employee.update({
            where: { id },
            data: {
                th_firstname,
                th_lastname,
                en_firstname,
                en_lastname,
                emp_id: emp_id ? parseInt(emp_id.toString()) : undefined,
                start_date: start_date ? new Date(start_date) : undefined,
                department,
                section,
                emp_card_id,
                email,
                website,
                company,
                file: fileName,
                name_font_size: body.name_font_size,
                en_name_font_size: body.en_name_font_size,
                id_font_size: body.id_font_size,
            }
        });

        return NextResponse.json(updatedStaff);
    } catch (error) {
        console.error("[STAFF_PATCH_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId);

        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const staff = await prisma.employee.findUnique({
            where: { id }
        });

        if (!staff) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Delete photo file
        if (staff.file) {
            const filePath = path.join(process.cwd(), "public", "uploads", staff.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.employee.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[STAFF_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
