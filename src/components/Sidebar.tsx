"use client";

import { useState, useTransition } from "react";
import { CircleChevronLeft, CircleChevronRight, Plus, Search, Folder, FolderOpen, Ellipsis, Bot, Files } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import clsx from "clsx";
import { useAssessments } from "@/lib/hooks/useAssessments";
import { useRouter, useParams } from "next/navigation";
import { NewAssessmentDialog } from "./NewAssessmentDialog";
import { DeleteAssessmentDialog } from "./DeleteAssessmentDialog";
import { useUser } from "@/lib/hooks/useUser";
import PageLoader from "./PageLoader";
import { Popover, PopoverTrigger } from "./ui/popover";
import { AssessmentOptionsPopover } from "./AssessmentOptionsPopover";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { queryClient } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { formatDateTime } from "@/lib/utils";

export default function Sidebar() {
  const {  data: user } = useUser();
  const { data: assessments = [] } = useAssessments(user?.id || "");
  const [expanded, setExpanded] = useState(true);
  const [newAssessmentsOpen, setNewAssessmentsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const router = useRouter();
  const params = useParams();
  const currentAssessmentId = params?.assessment_id as string | undefined;

  const updateAssessmentMutation = useMutation({
    mutationFn,
    onSuccess: (data) => {
      console.log("Assessment updated:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessments", user?.id || ""]
      });
    },
  });

  const handleOptionAction = (
    option: string,
    assessmentId: string,
    title: string
  ) => {
    if (option === "Rename") {
      setEditingId(assessmentId);
      setEditingTitle(title);
    } else if (option === "Delete") {
      setAssessmentToDelete(assessmentId);
      setDeleteDialogOpen(true);
    }

    console.log(`Action: ${option}, Assessment ID: ${assessmentId}`);
  }

  const saveEdit = (id: string) => {
    updateAssessmentMutation.mutate({
      url: `/assessment/${id}`,
      method: "PUT",
      body: { title: editingTitle },
    });

    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  return (
    <aside className={clsx(
      "flex flex-col bg-gray-100 border-r border-gray-200 transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex items-center justify-between px-2 py-4 border-b">
        {expanded && <span className="text-sm font-semibold ml-2">Menu</span>}
        <button
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer rounded-full w-4 h-4 !bg-gray-100 mr-2"
        >
          {expanded
            ? <CircleChevronLeft size={20} />
            : <CircleChevronRight size={20} />
          }
        </button>
      </div>

      <nav className="p-1 space-y-1 shrink-0">
        <Button
          variant="ghost"
          onClick={() => setNewAssessmentsOpen(true)}
          className="w-full justify-start cursor-pointer py-1 border-b border-t"
        >
          <Plus size={20} className="mr-2" />
          {expanded && "New Assessment"}
        </Button>

        <Button variant="ghost" className="w-full justify-start cursor-pointer p-1 border-t border-b !bg-gray-100">
          <Search size={20} className="mr-2" />
          {expanded && "Search Assessments"}
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            startTransition(() => {
              router.push("/files");
            });
          }}
          className="w-full justify-start cursor-pointer p-1 border-b"
        >
          <Files size={20} className="mr-2" />
          {expanded && "My Files"}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start cursor-not-allowed p-2 rounded-xl text-white bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-rose-500 hover:opacity-90 transition-all duration-300 shadow-md"
              >
                <Bot size={20} className="mr-2 text-white" />
                {expanded && "AI Tutor - Coming Soon"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Coming soon
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>

      <div className="flex-1 mt-1 border-t border-b shrink-0">
        {expanded &&
          <p
            className="px-3 py-2 text-xs text-muted-foreground font-semibold uppercase"
          >
            Assessments
          </p>
        }
        <ScrollArea
          className="flex-1 overflow-y-auto overflow-x-hidden mt-2 h-[calc(100vh-360px)]"
        >
        {/*h-[calc(100vh-220px)]*/}
          <ul className="space-y-2 pb-1 px-2">
            {[...assessments].reverse().map(a => (
              <li
                key={a.id}
                className={clsx(
                  "group bg-white rounded-md shadow-sm hover:shadow-md transition overflow-hidden",
                  expanded && "w-60"
                )}
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    onClick={() => {
                      startTransition(() => {
                        router.push(`/assessment/${a.id}`)
                      })
                    }}
                    className="flex-1 cursor-pointer text-left min-w-0 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      {editingId === a.id ? (
                        <input
                          autoFocus
                          className="text-sm border rounded px-1 w-full"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => saveEdit(a.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(a.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                      ) : (
                        <>
                          {currentAssessmentId === a.id ? (
                            <FolderOpen size={16} className="flex-shrink-0" />
                          ) : (
                            <Folder size={16} className="flex-shrink-0" />
                          )}
                          {expanded && <span className="truncate">{a.title}</span>}
                        </>
                      )}
                    </div>
                  </button>
                  
                  {expanded && (
                    <div className="flex items-center justify-center w-12 h-8 flex-shrink-0 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-400 group-hover:opacity-0 transition-opacity whitespace-nowrap">
                        {formatDateTime(a.created_at)}
                      </span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-opacity cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Ellipsis size={16} />
                          </button>
                        </PopoverTrigger>
                        <AssessmentOptionsPopover
                          action={handleOptionAction}
                          assessmentId={a.id}
                          title={a.title}
                        />
                      </Popover>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <NewAssessmentDialog
        open={newAssessmentsOpen}
        onOpenChange={setNewAssessmentsOpen}
      />
      {assessmentToDelete && (
        <DeleteAssessmentDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          assessmentId={assessmentToDelete}
        />
      )}
      {isPending ? <PageLoader /> : null}
    </aside>
  );
}
