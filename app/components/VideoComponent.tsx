"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc-client";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";

type Video = {
  id: string;
  title: string;
  description: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  videoData?: Buffer | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  controls: boolean;
  height: number;
  width: number;
  quality: number | null;
  userId: string | null;
  likesCount: number;
  isLiked: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function VideoComponent({ video }: { video: Video }) {
  const { data: session } = useSession();
  const utils = trpc.useUtils();

  const getVideoUrl = () => {
    return `/api/video/${video.id}`;
  };
  
  const toggleLikeMutation = trpc.video.toggleLike.useMutation({
    onSuccess: () => {
      utils.video.getAll.invalidate();
      utils.video.getById.invalidate({ id: video.id });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleLikeMutation.mutate({ videoId: video.id });
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video.id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <video
              src={getVideoUrl()}
              controls={video.controls}
              className="w-full h-full object-cover"
              preload="metadata"
              onError={(e) => {
                console.error('Video failed to load from database');
                if (video.videoUrl && e.currentTarget.src !== video.videoUrl) {
                  e.currentTarget.src = video.videoUrl;
                }
              }}
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video.id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-base-content/60">
            {video.user?.name || video.user?.email}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={!session || toggleLikeMutation.isPending}
              className={`btn btn-sm btn-ghost ${
                video.isLiked ? 'text-red-500' : 'text-base-content/60'
              } ${!session ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart 
                size={16} 
                fill={video.isLiked ? 'currentColor' : 'none'} 
              />
              <span className="text-xs">{video.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}