"use client";

import { Paperclip, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import Image from "next/image";
import { ChatPromptBoxProps } from "@/types";

export default function ChatPromptBox({ action }: ChatPromptBoxProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    action(message, files);
    setMessage("");
    setFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    setFiles(prev => [...prev, ...newFiles]);
  }

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-0 pb-4 z-10">
      {/*fixed bottom-0 left-0 right-0 ">*/}
      {/*<div className="w-full max-w-3xl fixed bottom-0 left-0 right-0
        mx-auto px-4 pb-4">*/}
      <div className="bg-white border rounded-xl shadow-sm p-2 flex flex-col gap-0">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2">
            {files.map((file, index) => (
              <div key={index} className="relative w-20 h-20 border rounded-md">
                {file.type.startsWith("image/") ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs
		  		                        text-gray-500 px-1 text-center">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </div>
                )}

                {/* X Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 w-4 h-4 flex items-center 
		  	                     justify-center bg-white/80 text-red-500 hover:text-red-700
		  	                     shadow-sm border rounded-full cursor-pointer z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Textarea
          placeholder="Type your message to create a new chat in this project..."
          className="resize-none border-0 shadow-none min-h-10 focus-visible:ring-0 
	  	               focus-visible:ring-offset-0"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-1 border px-1.5 py-1 rounded-xl
                  cursor-pointer text-gray-500 hover:text-gray-700
                  hover:bg-gray-100 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            <span className="text-sm">Attach</span>
            <input
              type="file"
              multiple
              // accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Button
            onClick={handleSend}
            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700
	  		               cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
