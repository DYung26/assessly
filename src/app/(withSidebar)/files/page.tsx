"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { formatDateTime } from "@/lib/utils";
import { useFilesPaginated } from "@/lib/hooks/useFilesPaginated";
import { FileGridSkeletonGroup } from "@/components/FileGridSkeleton";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

export default function FilesPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFilesPaginated({ limit: 10 });

  const observerTarget = useRef<HTMLDivElement>(null);

  const files = data?.pages.flatMap((page) => page.items) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <main className="flex flex-col flex-1 px-8 py-6 overflow-y-auto">
        <div className="max-w-7xl w-full mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Files</h1>
          <p className="text-sm text-gray-500 mb-6">
            All files you&apos;ve uploaded across assessments and chats
          </p>

          {isLoading ? (
            <FileGridSkeletonGroup count={12} />
          ) : files.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    <div className="relative w-full aspect-square border-b border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                      <FilePreview preview={file.download_url} />
                    </div>

                    <div className="flex-1 flex flex-col p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate mb-2">
                        {file.filename}
                      </h3>
                      <p className="text-xs text-gray-400 mt-auto">
                        {formatDateTime(file.uploaded_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div ref={observerTarget} className="py-8 flex justify-center">
                {isFetchingNextPage && (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">No files uploaded yet</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load files</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
