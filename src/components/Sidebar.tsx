"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Folder } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area"; // from shadcn/ui
import { Button } from "./ui/button";
import clsx from "clsx";

const dummyAssessments = [
  { id: 1, title: "Frontend Project", tags: ["React", "UI"], date: "2025-07-19" },
  { id: 2, title: "System Design", tags: ["Architecture"], date: "2025-07-18" },
  { id: 3, title: "Backend Auth", tags: ["Node", "Security"], date: "2025-07-15" },
  { id: 4, title: "Frontend Project", tags: ["React", "UI"], date: "2025-07-19" },
  { id: 5, title: "System Design", tags: ["Architecture"], date: "2025-07-18" },
  { id: 6, title: "Backend Auth", tags: ["Node", "Security"], date: "2025-07-15" },
  { id: 7, title: "Frontend Project", tags: ["React", "UI"], date: "2025-07-19" },
  { id: 8, title: "System Design", tags: ["Architecture"], date: "2025-07-18" },
  { id: 9, title: "Backend Auth", tags: ["Node", "Security"], date: "2025-07-15" },
  // Add more to test scroll
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={clsx(
      "bg-gray-100 border-r border-gray-200 transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between px-2 py-1 border-b">
        {expanded && <span className="text-sm font-semibold ml-2">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto cursor-pointer rounded-full w-4 h-4"
        >
          {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <nav className="p-1 space-y-0 shrink-0">
        <Button variant="ghost" className="w-full justify-start cursor-pointer py-1">
          <Plus size={18} className="mr-2" />
          {expanded && "New Assessment"}
        </Button>

        <Button variant="ghost" className="w-full justify-start cursor-pointer py-1">
          <Search size={18} className="mr-2" />
          {expanded && "Search Assessments"}
        </Button>
      </nav>

      <div className="mt-1 border-t shrink-0">
        {expanded && <p className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase">Assessments</p>}
        <ScrollArea className="flex-1 h-[calc(100vh-220px)] px-2 overflow-y-auto"> {/*h-[calc(100vh-220px)]*/}
          <ul className="space-y-2 pb-1">
            {dummyAssessments.map(a => (
              <li key={a.id} className="bg-white p-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <Folder size={16} />
                  {expanded ? a.title : null}
                </div>
                {expanded && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <div className="flex gap-2 flex-wrap">
                      {a.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-200 rounded px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400">{a.date}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </aside>
  );
}
