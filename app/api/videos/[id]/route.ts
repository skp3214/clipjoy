import dbConnect from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: { id: string } }) {    
    try {
        const { params } = context;
        const { id } = params;
        console.log("id", id);
        if (!id) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        await dbConnect();
        const video = await Video.findById(id).lean();

        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 });
    }
}