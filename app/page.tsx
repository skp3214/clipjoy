"use client";

import React from "react";
import VideoFeed from "./components/VideoFeed";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ClipJoy</h1>
      <VideoFeed />
    </main>
  );
}