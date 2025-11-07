import { FilePlus2, Pencil } from "lucide-react";
import { Popover, PopoverTrigger } from "./ui/popover";
import { InstructionsPopover } from "./InstructionsPopover";
import { ContextDockProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { useCallback } from "react";

export default function ContextDock ({ action }: ContextDockProps) {
  const uploadFileMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      // setFileId(data.data.id);
      action(data.data.id);
    },
    onError: (error) => {
      console.error("File upload failed:", error);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    newFiles.forEach(file => {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file.name);

      uploadFileMutation.mutateAsync({
        url: "/files/upload",
        body: formData,
      });
    });
  }

  const handleInstructions = useCallback((instructions: string[]) => {
    action("", instructions);
  }, [action]);

  // const removeInstruction = (indexToRemove: number) => {
  //   setInstructions(prev => prev.filter((_, index) => index !== indexToRemove));
  // };

  // const removeFile = (indexToRemove: number) => {
  //   setFileIds(prev => prev.filter((_, index) => index !== indexToRemove));
  // };

  // useEffect(() => {
  //   action(fileId, instructions);
  // }, [fileId, instructions, action]);

  return (
    <div className="flex justify-between max-w-3xl w-full gap-16">
      <label className="flex-1 flex justify-between items-center gap-4 p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer text-black">
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">Upload marking scheme</span>
          <span className="text-xs text-gray-500">PDF, DOCX</span>
        </div>

        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
          <FilePlus2 size={18} />
        </div>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex-1 flex justify-between items-center p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-pointer text-black">
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">Add instructions</span>
              <span className="text-xs text-gray-500">Tailor the way Aslyn responds to this assessment</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              <Pencil size={18} />
            </div>
          </div>
        </PopoverTrigger>
        <InstructionsPopover action={handleInstructions} />
      </Popover>

      {/*<InstructionsDialog open={instructionsOpen} onOpenChange={setInstructionsOpen} />*/}
    </div>
  );
}
