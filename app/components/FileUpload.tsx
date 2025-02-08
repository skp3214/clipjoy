"use client";
import { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

type FileUploadProps = {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileTypes?: "image" | "video";
}

export default function FileUpload({ onSuccess, onProgress, fileTypes = "image" }: FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: { message: string }) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
    };

    const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false);
        setError(null);
        onSuccess(res);
    };

    const handleProgress = (event: ProgressEvent) => {
        if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
        }
    };

    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    };

    const validateFile = (file: File) => {
        if (fileTypes === "video") {
            if (!file.type.startsWith("video/")) {
                setError("Invalid file type. Please upload a video file.");
                return false;
            }
            if (file.size > 100 * 1024 * 1024) {
                setError("File size should be less than 100MB");
                return false;
            }
        }
        else {
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validTypes.includes(file.type)) {
                setError("Invalid file type. Please upload an image file.");
                return false;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError("File size should be less than 10MB");
                return false;
            }
        }
        return true;
    }
    return (
        <div className="space-y-2">

            <IKUpload
                fileName={fileTypes === "video" ? "video.mp4" : "image.jpg"}
                useUniqueFileName={true}
                validateFile={validateFile}

                onError={onError}
                onSuccess={handleSuccess}
                onUploadProgress={handleProgress}
                onUploadStart={handleStartUpload}
                accept={fileTypes === "video" ? "video/*" : "image/*"}
                className="file-input file-input-bordered w-full"
                folder={fileTypes === "video" ? "/videos" : "/images"}
            />
            {
                uploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                        <Loader2 className="animate-spin w-4 h-4"/>
                        <span>Uploading...</span>
                    </div>
                )
            }
            {
                error && (
                    <div className="text-error text-sm">{error}</div>
                )
            }
        </div>
    );
}