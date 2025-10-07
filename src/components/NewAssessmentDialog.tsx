import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { useUser } from "@/lib/hooks/useUser";
import { useState } from "react";
import { ThreeDotLoader } from "./ui/three-dot-loader";
import { queryClient } from "@/lib/queryClient";
import { useRouter } from "next/navigation";

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const nameSchema = z.object({
  name: z.string().min(0).max(100).optional(),
});

type NameSchema = z.infer<typeof nameSchema>;

export function NewAssessmentDialog({ open, onOpenChange }: NewAssessmentDialogProps) {
  const { data: user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: "",
    },
  });

  const newAssessmentMutation = useMutation({
    mutationFn: mutationFn,
    onMutate: () => setIsSubmitting(true),
    onSettled: () => setIsSubmitting(false),
    onSuccess: (data) => {
      console.log("New assessment created:", data);
      queryClient.invalidateQueries({
        queryKey: ["assessments", user?.id]
      });
      onOpenChange(false);
      router.push(`/assessment/${data.data.id}`);
      form.reset();
    },
  });

  const onSubmit = (data: NameSchema) => {
    console.log("Form submitted with data:", data);
    newAssessmentMutation.mutate({
      url: "/assessment",
      body: {
        user_id: user?.id,
        title: data.name
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-max">
        <DialogHeader>
          <DialogTitle>New Assessment</DialogTitle>
          <DialogDescription>
            Type an assessment name and press Enter, or just press Enter to skip.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/*<FormLabel>Name</FormLabel>*/}
                  <FormControl>
                    <input
                      {...field}
                      className="w-full p-2 border rounded"
                      placeholder="Enter assessment name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
            </FormField>
          </form>
        </Form>
        <DialogFooter className="flex items-center justify-center sm:justify-center">
          {isSubmitting ? <ThreeDotLoader className="bg-black"/> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
