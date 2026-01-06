"use client";

import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/hooks/useUser";
import axiosInstance from "@/lib/axiosInstance";
import dynamic from "next/dynamic";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

interface UserFile {
  id: string;
  filename: string;
  download_url: string;
  uploaded_at: string;
  assessment_id?: string;
  assessment_title?: string;
  message_id?: string;
}

export default function FilesPage() {
  const { data: user } = useUser();

  const { data: filesData, isLoading } = useQuery({
    queryKey: ["user-files", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/${user?.id}/files`);
      return res.data.data.files as UserFile[];
    },
    enabled: !!user?.id,
  });

  const files = filesData || [];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main className="flex flex-col flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Files</h1>
          <p className="text-sm text-gray-500 mb-6">
            All files you&apos;ve uploaded across assessments and chats
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="relative w-16 h-16 border rounded-md flex-shrink-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <FilePreview preview={file.download_url} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {file.filename}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      {file.assessment_id && file.assessment_title && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Assessment:</span>
                          <span className="truncate">{file.assessment_title}</span>
                        </span>
                      )}
                      {file.message_id && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Message ID:</span>
                          <span>{file.message_id}</span>
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-xs text-gray-400">
                    ID: {file.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
