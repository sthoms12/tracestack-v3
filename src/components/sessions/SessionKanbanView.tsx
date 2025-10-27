import { Session, SessionEntry, KanbanState, SessionEntryType } from "@shared/types";
import { useMemo, useState, useEffect } from "react";
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Workflow, Search, StickyNote, GripVertical } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
const entryIcons: Record<SessionEntryType, React.ReactNode> = {
  [SessionEntryType.Hypothesis]: <Lightbulb className="h-4 w-4 text-yellow-500" />,
  [SessionEntryType.Action]: <Workflow className="h-4 w-4 text-blue-500" />,
  [SessionEntryType.Finding]: <Search className="h-4 w-4 text-green-500" />,
  [SessionEntryType.Note]: <StickyNote className="h-4 w-4 text-gray-500" />,
};
function KanbanCard({ entry }: { entry: SessionEntry }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: entry.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-4 touch-none">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-3 flex items-start gap-2">
          <div {...listeners} className="p-1 cursor-grab touch-none">
            <GripVertical className="h-5 w-5 text-muted-foreground/50" />
          </div>
          <div className="flex-grow">
            <p className="text-sm">{entry.content}</p>
            <div className="flex items-center gap-2 mt-2">
              {entryIcons[entry.type]}
              <Badge variant="outline" className="capitalize text-xs">{entry.type}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function KanbanColumn({ title, entries, state }: { title: string; entries: SessionEntry[]; state: KanbanState }) {
  const { setNodeRef } = useSortable({ id: state });
  return (
    <div ref={setNodeRef} className="flex-1 bg-secondary/50 rounded-lg p-4 min-h-[200px]">
      <h3 className="font-semibold mb-4 text-lg capitalize">{title}</h3>
      <SortableContext items={entries.map(e => e.id)} strategy={verticalListSortingStrategy}>
        {entries.map(entry => (
          <KanbanCard key={entry.id} entry={entry} />
        ))}
      </SortableContext>
    </div>
  );
}
export default function SessionKanbanView({ session }: { session: Session }) {
  const queryClient = useQueryClient();
  const [entries, setEntries] = useState(session.entries);
  useEffect(() => {
    setEntries(session.entries);
  }, [session.entries]);
  const columns = useMemo(() => ({
    [KanbanState.Todo]: entries.filter(e => e.kanbanState === KanbanState.Todo),
    [KanbanState.InProgress]: entries.filter(e => e.kanbanState === KanbanState.InProgress),
    [KanbanState.Done]: entries.filter(e => e.kanbanState === KanbanState.Done),
  }), [entries]);
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));
  const updateKanbanStateMutation = useMutation({
    mutationFn: ({ entryId, newState }: { entryId: string; newState: KanbanState }) =>
      api(`/api/sessions/${session.id}/entries/${entryId}/kanban`, {
        method: 'PUT',
        body: JSON.stringify({ kanbanState: newState }),
      }),
    onMutate: async ({ entryId, newState }) => {
      await queryClient.cancelQueries({ queryKey: ['session', session.id] });
      const previousEntries = entries;
      setEntries(prev => prev.map(e => e.id === entryId ? { ...e, kanbanState: newState } : e));
      return { previousEntries };
    },
    onSuccess: () => {
      toast.success("Entry updated");
    },
    onError: (error, _variables, context) => {
      if (context?.previousEntries) {
        setEntries(context.previousEntries);
      }
      toast.error(`Failed to update entry: ${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['session', session.id] });
    },
  });
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeEntry = entries.find(e => e.id === active.id);
    if (!activeEntry) return;

    const oldContainerId = activeEntry.kanbanState;
    let newContainerId: KanbanState | undefined;

    // Check if dropping directly on a column
    if (Object.values(KanbanState).includes(over.id as KanbanState)) {
      newContainerId = over.id as KanbanState;
    } else {
      // Dropping on another card, find its container
      const overEntry = entries.find(e => e.id === over.id);
      if (overEntry) {
        newContainerId = overEntry.kanbanState;
      }
    }

    if (newContainerId && newContainerId !== oldContainerId) {
      updateKanbanStateMutation.mutate({ entryId: active.id as string, newState: newContainerId });
    }
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-6">
        <KanbanColumn title="To Do" entries={columns[KanbanState.Todo]} state={KanbanState.Todo} />
        <KanbanColumn title="In Progress" entries={columns[KanbanState.InProgress]} state={KanbanState.InProgress} />
        <KanbanColumn title="Done" entries={columns[KanbanState.Done]} state={KanbanState.Done} />
      </div>
    </DndContext>
  );
}