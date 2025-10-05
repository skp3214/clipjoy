"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type FileUploadProps = {
    onSuccess: (res: { fileName: string; fileData: ArrayBuffer; mimeType: string; fileSize: number }) => void;
    onProgress?: (progress: number) => void;
    fileTypes?: "image" | "video";
}

export default function FileUpload({ onSuccess, onProgress, fileTypes = "image" }: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateFile(file)) return;

        setUploading(true);
        setError(null);

        try {
            const fileData = await file.arrayBuffer();
            
            if (onProgress) {
                for (let i = 0; i <= 100; i += 10) {
                    onProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            onSuccess({
                fileName: file.name,
                fileData,
                mimeType: file.type,
                fileSize: file.size
            });

        } catch (error) {
            setError("Failed to read file");
            console.error("File read error:", error);
        } finally {
            setUploading(false);
        }
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
            <input
                type="file"
                onChange={handleFileChange}
                accept={fileTypes === "video" ? "video/*" : "image/*"}
                className="file-input file-input-bordered w-full"
                disabled={uploading}
            />
            {uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span>Processing file...</span>
                </div>
            )}
            {error && (
                <div className="text-error text-sm">{error}</div>
            )}
        </div>
    );
}