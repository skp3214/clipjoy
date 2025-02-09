"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import VideoComponent from "@/app/components/VideoComponent";

const VideoPage = ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const [video, setVideo] = useState<IVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            apiClient
                .getVideo(id)
                .then((data) => {
                    setVideo(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>No video found</div>;

    return (
        <div>
            <VideoComponent video={video} />
        </div>
    );
};

export default VideoPage;
