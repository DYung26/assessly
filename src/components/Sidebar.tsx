"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Folder } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area"; // from shadcn/ui
import { Button } from "./ui/button";
import clsx from "clsx";
import { useAssessments } from "@/lib/hooks/useAssessments";
import { useRouter } from "next/navigation";
import { NewAssessmentDialog } from "./NewAssessmentDialog";
import { useUser } from "@/lib/hooks/useUser";
import PageLoader from "./PageLoader";

export default function Sidebar() {
  const {  data: user } = useUser();
  const { data: assessments = [] } = useAssessments(user?.id || "");
  const [expanded, setExpanded] = useState(true);
  const [newAssessmentsOpen, setNewAssessmentsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <aside className={clsx(
      "flex flex-col bg-gray-100 border-r border-gray-200 transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between px-2 py-4 border-b">
        {expanded && <span className="text-sm font-semibold ml-2">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto cursor-pointer rounded-full w-4 h-4 !bg-gray-100"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <nav className="p-1 space-y-1 shrink-0">
        <Button
          variant="ghost"
          onClick={() => setNewAssessmentsOpen(true)}
          className="w-full justify-start cursor-pointer py-1 border-b border-t"
        >
          <Plus size={18} className="mr-2" />
          {expanded && "New Assessment"}
        </Button>

        <Button variant="ghost" className="w-full justify-start cursor-pointer p-1 border-t border-b !bg-gray-100">
          <Search size={18} className="mr-2" />
          {expanded && "Search Assessments"}
        </Button>
      </nav>

      <div className="flex-1 mt-1 border-t border-b shrink-0">
        {expanded && <p className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase">Assessments</p>}
        <ScrollArea className="flex-1 px-2 overflow-y-auto mt-2 h-[calc(100vh-300px)]">
        {/*h-[calc(100vh-220px)]*/}
          <ul className="space-y-2 pb-1">
            {[...assessments].reverse().map(a => (
              <li key={a.id}> 
                <button
                  onClick={() => {
                    startTransition(() => {
                      router.push(`/assessment/${a.id}`)
                    })
                  }}
                  className="bg-white p-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer w-full"
                >
                  <div className="flex items-center gap-2 text-left text-sm font-medium text-gray-800">
                    <Folder size={16} />
                    {expanded ? a.title : null}
                  </div>
                  {expanded && (
                    <div className="mt-1 text-left text-xs text-gray-500 space-y-1">
                      <div className="flex gap-2 flex-wrap">
                        {/*a.tags.map(tag => (
                           <span
                            key={tag}
                            className="bg-gray-200 rounded px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))*/}
                      </div>
                      <p className="text-[10px] text-gray-400">{a.created_at}</p>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <NewAssessmentDialog open={newAssessmentsOpen} onOpenChange={setNewAssessmentsOpen} />
      {isPending ? <PageLoader /> : null}
    </aside>
  );
}
