"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import VideoComponent from "@/app/components/VideoComponent";

const VideoPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [video, setVideo] = useState<IVideo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchParams = async () => {
            const { id } = await params;
            if (id) {
                apiClient.getVideo(id)
                    .then((data) => {
                        setVideo(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err.message);
                        setLoading(false);
                    });
            }
        };

        fetchParams();
    }, [params]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>No video found</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
                <VideoComponent video={video} />
            </div>
        </div>
    );
};

export default VideoPage;