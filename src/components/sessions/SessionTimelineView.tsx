import { Session, SessionEntry, SessionEntryType } from "@shared/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Workflow, Search, StickyNote } from "lucide-react";
import { format } from 'date-fns';
const entrySchema = z.object({
  type: z.nativeEnum(SessionEntryType),
  content: z.string().min(1, "Content cannot be empty."),
});
type NewEntryForm = z.infer<typeof entrySchema>;
const entryIcons: Record<SessionEntryType, React.ReactNode> = {
  [SessionEntryType.Hypothesis]: <Lightbulb className="h-5 w-5 text-yellow-500" />,
  [SessionEntryType.Action]: <Workflow className="h-5 w-5 text-blue-500" />,
  [SessionEntryType.Finding]: <Search className="h-5 w-5 text-green-500" />,
  [SessionEntryType.Note]: <StickyNote className="h-5 w-5 text-gray-500" />,
};
const entryBorderColors: Record<SessionEntryType, string> = {
  [SessionEntryType.Hypothesis]: "border-yellow-500/50",
  [SessionEntryType.Action]: "border-blue-500/50",
  [SessionEntryType.Finding]: "border-green-500/50",
  [SessionEntryType.Note]: "border-gray-500/50",
};
export default function SessionTimelineView({ session }: { session: Session }) {
  const queryClient = useQueryClient();
  const form = useForm<NewEntryForm>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: SessionEntryType.Action,
      content: "",
    },
  });
  const addEntryMutation = useMutation({
    mutationFn: (newEntry: NewEntryForm) => api<SessionEntry>(`/api/sessions/${session.id}/entries`, {
      method: 'POST',
      body: JSON.stringify(newEntry),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', session.id] });
      toast.success("Entry added successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to add entry: ${error.message}`);
    },
  });
  function onSubmit(values: NewEntryForm) {
    addEntryMutation.mutate(values);
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="What's your next step, hypothesis, or finding?" {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select entry type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(SessionEntryType).map(type => (
                            <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={addEntryMutation.isPending}>
                  {addEntryMutation.isPending ? "Adding..." : "Add Entry"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="relative pl-8">
        <div className="absolute left-4 top-4 bottom-4 w-px bg-border -z-10"></div>
        {session.entries.map((entry) => (
          <div key={entry.id} className="relative mb-8">
            <div className="absolute -left-1.5 top-1.5 h-7 w-7 bg-background rounded-full flex items-center justify-center">
              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-secondary">
                {entryIcons[entry.type]}
              </div>
            </div>
            <div className={`ml-8 p-4 rounded-lg border bg-card ${entryBorderColors[entry.type]}`}>
              <p className="text-sm text-foreground">{entry.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{format(new Date(entry.createdAt), 'PPp')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}