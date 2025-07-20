import { cn } from "@/lib/utils";

export function ThreeDotLoader({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center space-x-1">
      <span className={cn("h-4 w-4 rounded-full animate-bounce [animation-delay:-0.3s]", className)} />
      <span className={cn("h-4 w-4 rounded-full animate-bounce [animation-delay:-0.15s]", className)} />
      <span className={cn("h-4 w-4 rounded-full animate-bounce", className)} />
    </div>
  );
}
