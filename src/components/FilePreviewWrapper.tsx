import { useEffect } from "react";
// import { FilePreview } from 'reactjs-file-preview';
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

export default function FilePreviewWrapper(
  { file, onUploaded }: { file: File; onUploaded: ((fileId: string) => void) | undefined }
) {
  const uploadFileMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      onUploaded?.(data.data.fileId);
    },
    onError: (error) => {
      console.error("[FPW] File upload failed:", error);
    },
  });

  // start upload when component mounts
  useEffect(() => {
    const formData = new FormData();
    formData.append("file", file);

    uploadFileMutation.mutateAsync({
      url: "/files/upload",
      body: formData,
    });
  }, [file, uploadFileMutation]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {uploadFileMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        </div>
      )}
      <FilePreview preview={file} />
    </div>
  );
}

