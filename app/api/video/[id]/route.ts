import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    }) as any;

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    if (!video.videoData) {
      return new NextResponse("Video data not available", { status: 404 });
    }

    // Set appropriate headers for video streaming
    const headers = new Headers();
    headers.set("Content-Type", video.mimeType || "video/mp4");
    headers.set("Content-Length", video.fileSize?.toString() || "");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Handle range requests for video seeking
    const range = request.headers.get("range");
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : video.videoData.length - 1;
      const chunksize = end - start + 1;

      headers.set("Content-Range", `bytes ${start}-${end}/${video.videoData.length}`);
      headers.set("Content-Length", chunksize.toString());

      return new NextResponse(video.videoData.slice(start, end + 1), {
        status: 206, // Partial Content
        headers,
      });
    }

    return new NextResponse(video.videoData, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error serving video:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}