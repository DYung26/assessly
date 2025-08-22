import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { mutationFn } from "@/lib/mutationFn";
import { useUser } from "@/lib/hooks/useUser";

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const nameSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type NameSchema = z.infer<typeof nameSchema>;

export function NewAssessmentDialog({ open, onOpenChange }: NewAssessmentDialogProps) {
  const { data: user } = useUser();

  const form = useForm<NameSchema>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: "",
    },
  });

  const newAssessmentMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      console.log("New assessment created:", data);
      onOpenChange(false);
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
          <DialogDescription>Enter an assessment name or leave empty and press enter for AI-suggested name</DialogDescription>
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
      </DialogContent>
    </Dialog>
  );
}
