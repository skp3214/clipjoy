"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import FileUpload from "./FileUpload";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoData?: ArrayBuffer;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}

export default function VideoUploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<{
    fileName: string;
    fileData: ArrayBuffer;
    mimeType: string;
    fileSize: number;
  } | null>(null);
  const { showNotification } = useNotification();
  const router = useRouter();
  const utils = trpc.useUtils();

  const createVideoMutation = trpc.video.create.useMutation({
    onSuccess: () => {
      showNotification("Video published successfully!", "success");
      utils.video.getAll.invalidate();
      
      setValue("title", "");
      setValue("description", "");
      setVideoFile(null);
      setUploadProgress(0);
      
      router.push("/");
    },
    onError: (error) => {
      showNotification(error.message || "Failed to publish video", "error");
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleUploadSuccess = (response: {
    fileName: string;
    fileData: ArrayBuffer;
    mimeType: string;
    fileSize: number;
  }) => {
    setVideoFile(response);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!videoFile) {
      showNotification("Please upload a video first", "error");
      return;
    }

    const videoBuffer = Buffer.from(videoFile.fileData);

    createVideoMutation.mutate({
      title: data.title,
      description: data.description,
      videoData: videoBuffer,
      fileName: videoFile.fileName,
      mimeType: videoFile.mimeType,
      fileSize: videoFile.fileSize,
      controls: true,
      height: 1920,
      width: 1080,
      quality: 100,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">Title</label>
        <input
          type="text"
          className={`input input-bordered ${
            errors.title ? "input-error" : ""
          }`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <span className="text-error text-sm mt-1">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="form-control">
        <label className="label">Upload Video</label>
        <FileUpload
          fileTypes="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={createVideoMutation.isPending || !videoFile}
      >
        {createVideoMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}