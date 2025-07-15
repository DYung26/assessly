"use client";

import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "./ui/button";

export default function ChatPromptBox() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4"> {/*fixed bottom-0 left-0 right-0 ">*/}
    {/*<div className="w-full max-w-3xl fixed bottom-0 left-0 right-0 mx-auto px-4 pb-4">*/}
      <div className="bg-white border rounded-xl shadow-sm p-2 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {/* Future buttons like send/attach */}
        <Button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
	  <Send className="w-4 h-4"/>
	</Button>
      </div>
    </div>
  );
}
