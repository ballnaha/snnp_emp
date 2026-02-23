import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string | string[] } }
) {
    try {
        const resolvedParams = await (params as any);
        // If the route is [path], it might only capture one segment.
        // For nested paths, we usually need [...path].
        // But let's see if we can decode it if it's passed as card/file.png
        const filename = decodeURIComponent(resolvedParams.path);

        const filePath = path.join(process.cwd(), "public", "uploads", filename);

        if (!fs.existsSync(filePath)) {
            // Try checking without the filename decoding just in case
            if (!fs.existsSync(path.join(process.cwd(), "public", "uploads", resolvedParams.path))) {
                return new NextResponse("Image not found", { status: 404 });
            }
        }

        const finalPath = fs.existsSync(filePath) ? filePath : path.join(process.cwd(), "public", "uploads", resolvedParams.path);
        const fileBuffer = fs.readFileSync(finalPath);
        const extension = path.extname(finalPath).toLowerCase();

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
