"use client";

import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { useMemo, useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [meta, setMeta] = useState<{ w: number; h: number } | null>(null);

  const orientation = useMemo<"portrait" | "landscape" | "unknown">(() => {
    if (!meta) return "unknown";
    return meta.h >= meta.w ? "portrait" : "landscape";
  }, [meta]);

  // Use the natural aspect ratio when known; default to 9:16 for a reels-like look
  const aspect = useMemo(() => {
    if (!meta) return "9 / 16";
    return `${meta.w} / ${meta.h}`;
  }, [meta]);

  const transformation = useMemo(() => {
    // Request an optimized transformation matching the orientation
    if (orientation === "landscape") {
      return [
        {
          width: "1280",
          height: "720",
        },
      ];
    }
    return [
      {
        width: "1080",
        height: "1920",
      },
    ];
  }, [orientation]);

  const onLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const v = e.currentTarget;
    if (v && v.videoWidth && v.videoHeight) {
      setMeta({ w: v.videoWidth, h: v.videoHeight });
    }
  };

  const videoClassName = useMemo(() => {
    // On mobile, keep landscape videos contained to avoid awkward cropping.
    // On larger screens, cover looks better inside the card.
    const base = "w-full h-full";
    if (orientation === "landscape") {
      return `${base} object-contain sm:object-cover`;
    }
    return `${base} object-cover`;
  }, [orientation]);

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative p-4 pb-0">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full bg-base-200"
            style={{ aspectRatio: aspect }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={transformation}
              controls={video.controls}
              className={videoClassName}
              onLoadedMetadata={onLoadedMetadata}
              playsInline
              preload="metadata"
              poster={video.thumbnailUrl}
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg line-clamp-2">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}