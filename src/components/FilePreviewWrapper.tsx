// import { FilePreview } from 'reactjs-file-preview';
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const FilePreview = dynamic(() => import("reactjs-file-preview"), {
  ssr: false,
});

export default function FilePreviewWrapper(
  { file, isPending }: { file: File; isPending: boolean }
) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        </div>
      )}
      <FilePreview preview={file} />
    </div>
  );
}

