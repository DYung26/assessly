import { useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function InstructionEditorPopover(
  { action }: { action: (text: string) => void }
) {
  const [input, setInput] = useState("");

  const handleSave = () => {
    if (input.trim()) {
      action(input.trim());
      // setInput("");
    }
  };

  return (
    <PopoverContent className="w-80 p-4 space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Custom Instructions</h3>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your custom instructions here..."
        className="w-full min-h-[100px] resize-none"
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!input.trim()}
          className="cursor-pointer"
        >
          Save
        </Button>
      </div>
    </PopoverContent>
  );
}

