import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const [totalEmployees, totalUsers] = await Promise.all([
            prisma.employee.count(),
            prisma.user.count()
        ]);

        // Calculate new employees this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newEmployeesThisMonth = await prisma.employee.count({
            where: {
                created_at: {
                    gte: startOfMonth
                }
            }
        });

        // Fetch recent employees
        const recentEmployees = await prisma.employee.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                th_firstname: true,
                th_lastname: true,
                department: true,
                file: true,
                created_at: true
            }
        });

        // Format activities to match the UI
        const activities = recentEmployees.map((emp, index) => {
            const colors = ['#11998E', '#0072FF', '#8E2DE2', '#FF8008', '#ec4899'];
            return {
                id: emp.id,
                action: 'เพิ่มข้อมูลพนักงานใหม่',
                user: `${emp.th_firstname || ''} ${emp.th_lastname || ''}`,
                image: emp.file,
                time: emp.created_at ? new Date(emp.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                }) : 'N/A',
                color: colors[index % colors.length]
            };
        });

        return NextResponse.json({
            totalEmployees,
            totalUsers,
            newEmployeesThisMonth,
            activities,
            user: session.user
        });
    } catch (error) {
        console.error("[DASHBOARD_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
