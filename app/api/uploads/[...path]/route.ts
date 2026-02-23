import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const resolvedParams = await (params as any);
        const pathSegments = resolvedParams.path;

        // Join segments to create the full relative path
        const relativePath = path.join(...pathSegments);
        const filePath = path.join(process.cwd(), "public", "uploads", relativePath);

        if (!fs.existsSync(filePath)) {
            return new NextResponse("Image not found", { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        const extension = path.extname(filePath).toLowerCase();

        let contentType = "image/jpeg";
        if (extension === ".png") contentType = "image/png";
        if (extension === ".webp") contentType = "image/webp";
        if (extension === ".svg") contentType = "image/svg+xml";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
