import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params; // Unwrap params
        const body = await req.json();
        const { name, username, password, role, status } = body;

        const updateData: any = {
            name,
            role,
            status,
        };

        if (username) {
            updateData.username = username;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params; // Unwrap params

        await prisma.user.delete({
            where: { id }
        });

        return new NextResponse("User deleted", { status: 200 });
    } catch (error) {
        console.error("[USER_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
