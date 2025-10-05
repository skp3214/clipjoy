"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import FileUpload from "./FileUpload";
import { trpc } from "@/lib/trpc-client";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export default function VideoUploadForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();
  const router = useRouter();
  const utils = trpc.useUtils();

  const createVideoMutation = trpc.video.create.useMutation({
    onSuccess: () => {
      showNotification("Video published successfully!", "success");
      utils.video.getAll.invalidate();
      
      // Reset form
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      
      // Redirect to home page
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
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    // Construct full ImageKit URLs
    const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
    const videoUrl = response.url || `${urlEndpoint}/${response.filePath}`;
    const thumbnailUrl = response.thumbnailUrl || videoUrl;
    
    setValue("videoUrl", videoUrl);
    setValue("thumbnailUrl", thumbnailUrl);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    createVideoMutation.mutate({
      title: data.title,
      description: data.description,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnailUrl,
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
        disabled={createVideoMutation.isPending || !uploadProgress}
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