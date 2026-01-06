import { PopoverContent } from "./ui/popover";

interface ChatOptionsPopoverProps {
  action: (option: string, chatId: string, title: string) => void;
  chatId: string;
  title: string;
}

export function ChatOptionsPopover(
  { action, chatId, title }: ChatOptionsPopoverProps
) {
  return (
    <PopoverContent
      side="bottom"
      align="start"
      className="w-48 p-2"
    >
      <div className="flex flex-col gap-2">
      {["Rename", "Delete"].map((option) => (
          <button
            key={option}
            onClick={() => action(option, chatId, title)}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
    </PopoverContent>
  )
}
