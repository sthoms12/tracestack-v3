import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api-client";
import { Session, PriorityLevel } from "@shared/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ReactNode } from "react";
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  environment: z.string().optional(),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.Medium),
  tags: z.string().optional(),
});
type CreateSessionForm = z.infer<typeof formSchema>;
type CreateSessionDialogProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export default function CreateSessionDialog({ children, open, onOpenChange }: CreateSessionDialogProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm<CreateSessionForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      environment: "",
      priority: PriorityLevel.Medium,
      tags: "",
    },
  });
  const createSessionMutation = useMutation({
    mutationFn: (newSession: Omit<CreateSessionForm, 'tags'> & { tags: string[] }) => api<Session>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify(newSession),
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessionStats'] });
      toast.success("Session created successfully!");
      onOpenChange(false);
      form.reset();
      navigate(`/app/sessions/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create session: ${error.message}`);
    },
  });
  function onSubmit(values: CreateSessionForm) {
    const tagsArray = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    createSessionMutation.mutate({ ...values, tags: tagsArray });
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Start a new troubleshooting session. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., API Gateway returning 502 errors" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief summary of the issue..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Production" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PriorityLevel).map(level => (
                          <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., api, database, networking" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={createSessionMutation.isPending}>
                {createSessionMutation.isPending ? "Creating..." : "Create Session"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}