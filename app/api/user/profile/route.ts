import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, username, role, currentPassword, newPassword } = body;

        // Fetch user to verify password and existence
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const updateData: any = {
            name: name || user.name,
            username: username || user.username,
            role: role || user.role, // Added role update support
        };

        // If password change is requested
        if (newPassword) {
            if (!currentPassword) {
                return new NextResponse("Current password is required", { status: 400 });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return new NextResponse("Invalid current password", { status: 403 });
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: updatedUser.name,
                username: updatedUser.username,
            }
        });

    } catch (error) {
        console.error("[PROFILE_UPDATE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
