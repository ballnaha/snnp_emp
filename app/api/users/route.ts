import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, username, password, role, status } = body;

        if (!name || !username || !password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return new NextResponse("Username already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                role: role || 'user',
                status: status || 'active',
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
