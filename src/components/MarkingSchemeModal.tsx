"use client";

import { useState, memo } from "react";
import { X, FilePlus2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { APP_CONFIG } from "@/lib/config";
import { toast } from "sonner";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

interface MarkingSchemeFile {
  id: string;
  filename: string;
  url?: string;
  download_url: string;
  uploaded_at: string;
}

interface MarkingSchemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentId: string;
  filesData?: MarkingSchemeFile[];
}

const MarkingSchemeFilePreview = memo(function MarkingSchemeFilePreview({
  file,
  onRemove,
  assessmentId,
}: {
  file: MarkingSchemeFile;
  onRemove: (id: string) => void;
  assessmentId: string;
}) {
  const deleteFileMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      onRemove(file.id);
      queryClient.invalidateQueries({
        queryKey: ["assessment-files", assessmentId],
      });
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete file", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleRemove = async () => {
    await deleteFileMutation.mutateAsync({
      url: `/assessment/${assessmentId}/files/${file.id}`,
      method: "DELETE",
    });
  };

  return (
    <div className="relative w-20 h-20 border rounded-md">
      <div className="relative w-full h-full flex items-center justify-center">
        {deleteFileMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        )}
        <FilePreview preview={file.url || file.download_url} />
      </div>
      <button
        onClick={handleRemove}
        disabled={deleteFileMutation.isPending}
        className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-white/80 text-red-500 hover:text-red-700 shadow-sm border rounded-full cursor-pointer z-10 disabled:opacity-50"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
});

export default function MarkingSchemeModal({
  open,
  onOpenChange,
  assessmentId,
  filesData,
}: MarkingSchemeModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["assessment-files", assessmentId] 
      });
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      toast.error("File upload failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    setIsUploading(true);
    const newFiles = Array.from(fileList);

    try {
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("assessment_id", assessmentId);

        await uploadMutation.mutateAsync({
          url: "/files/upload",
          body: formData,
        });
      }
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    queryClient.setQueryData(
      ["assessment-files", assessmentId],
      (old: MarkingSchemeFile[] | undefined) => {
        if (!old) return old;
        return old.filter((f) => f.id !== fileId);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Marking Schemes</DialogTitle>
          <DialogDescription>
            Upload and manage marking schemes for this assessment
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {!filesData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filesData.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-2">
              {filesData.map((file) => (
                <MarkingSchemeFilePreview
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                  assessmentId={assessmentId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No marking schemes uploaded yet
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <label className="w-full">
            <Button
              className="w-full"
              variant="outline"
              disabled={isUploading}
              asChild
            >
              <div className="cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FilePlus2 className="w-4 h-4" />
                    Upload Marking Scheme
                  </>
                )}
              </div>
            </Button>
            <input
              type="file"
              multiple
              accept={APP_CONFIG.ACCEPTED_FILE_TYPES}
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
}
