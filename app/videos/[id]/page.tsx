"use client";
import React, { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import VideoComponent from "@/app/components/VideoComponent";

const VideoPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [videoId, setVideoId] = useState<string | null>(null);

    useEffect(() => {
        const fetchParams = async () => {
            const { id } = await params;
            setVideoId(id);
        };

        fetchParams();
    }, [params]);

    const { data: video, isLoading, error } = trpc.video.getById.useQuery(
        { id: videoId! },
        { enabled: !!videoId }
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-error">Error: {error.message}</p>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="text-center py-12">
                <p className="text-base-content/70">No video found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <VideoComponent video={video as any} />
            </div>
        </div>
    );
};

export default VideoPage;