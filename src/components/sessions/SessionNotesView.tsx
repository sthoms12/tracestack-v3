import { Session } from "@shared/types";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
type SavingState = 'idle' | 'saving' | 'saved';
export default function SessionNotesView({ session }: { session: Session }) {
  const [notes, setNotes] = useState(session.rawNotes || "");
  const [savingState, setSavingState] = useState<SavingState>('idle');
  const queryClient = useQueryClient();
  const updateNotesMutation = useMutation({
    mutationFn: (updatedNotes: string) => api(`/api/sessions/${session.id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes: updatedNotes }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', session.id] });
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    },
    onError: (error) => {
      toast.error(`Failed to save notes: ${error.message}`);
      setSavingState('idle');
    },
  });
  const handleSave = useCallback(() => {
    if (notes !== session.rawNotes) {
      setSavingState('saving');
      updateNotesMutation.mutate(notes);
    }
  }, [notes, session.rawNotes, updateNotesMutation]);
  useDebounce(handleSave, 1500, [notes]);
  useEffect(() => {
    setNotes(session.rawNotes || "");
  }, [session.rawNotes]);
  const getSavingText = () => {
    switch (savingState) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      default:
        return 'Auto-saves';
    }
  };
  return (
    <div className="relative">
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down your unstructured thoughts, logs, or snippets here..."
        className="min-h-[500px] text-base font-mono"
      />
      <Badge
        variant={savingState === 'saved' ? 'default' : 'secondary'}
        className="absolute bottom-3 right-3 transition-opacity"
      >
        {getSavingText()}
      </Badge>
    </div>
  );
}