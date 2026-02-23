import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
    try {
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
            file // This is base64 string
        } = body;

        if (!th_firstname || !th_lastname || !en_firstname || !en_lastname || !emp_id) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        let fileName = null;
        if (file && file.startsWith('data:image')) {
            const base64Data = file.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            // Generate filename: รหัสพนักงาน_ชื่อพนักงาน
            // ทำการ trim และลบช่องว่างออก
            const cleanName = en_firstname.trim().replace(/\s+/g, '_');
            fileName = `${emp_id}_${cleanName}.jpg`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Use SHARP to resize and compress
            await sharp(buffer)
                .resize(1000, 991, { // ปรับให้ตรงกับสัดส่วนพื้นที่รูปในบัตร (350:347)
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toFile(path.join(uploadDir, fileName));
        }

        const emp = await prisma.employee.create({
            data: {
                th_firstname,
                th_lastname,
                en_firstname,
                en_lastname,
                emp_id: emp_id ? parseInt(emp_id.toString()) : null,
                start_date: start_date ? new Date(start_date) : null,
                department,
                section,
                emp_card_id,
                email,
                website: website || "snnp.co.th",
                company: company || "SNNP",
                file: fileName, // Save only filename
                name_font_size: body.name_font_size,
                en_name_font_size: body.en_name_font_size,
                id_font_size: body.id_font_size,
            }
        });

        return NextResponse.json(emp);
    } catch (error) {
        console.error("[EMPLOYEE_CREATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: any = {};
        if (q) {
            where.OR = [
                { th_firstname: { contains: q } },
                { th_lastname: { contains: q } },
                { en_firstname: { contains: q } },
                { en_lastname: { contains: q } },
                { emp_id: isNaN(parseInt(q)) ? undefined : { equals: parseInt(q) } }
            ].filter(f => f.emp_id !== undefined || !('emp_id' in f));
        }

        const [staff, total] = await Promise.all([
            prisma.employee.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    created_at: 'desc',
                }
            }),
            prisma.employee.count({ where })
        ]);

        return NextResponse.json({
            staff,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error("[EMPLOYEE_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
