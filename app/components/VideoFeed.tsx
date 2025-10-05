"use client";

import { trpc } from "@/lib/trpc-client";
import VideoComponent from "./VideoComponent";

export default function VideoFeed() {
  const { data: videos, isLoading, error } = trpc.video.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-base-300 aspect-[9/16] rounded-lg"></div>
            <div className="mt-2 h-4 bg-base-300 rounded"></div>
            <div className="mt-1 h-3 bg-base-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error">Failed to load videos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos?.map((video: any) => (
        <VideoComponent key={video.id} video={video} />
      ))}

      {(!videos || videos.length === 0) && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No videos found</p>
        </div>
      )}
    </div>
  );
}