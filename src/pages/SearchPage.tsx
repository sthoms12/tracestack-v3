import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Session, SessionEntry } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, FileSearch } from "lucide-react";
import { useState, useMemo } from "react";
import SearchResultCard from "@/components/search/SearchResultCard";
interface SearchResult {
  session: Session;
  matchedEntry?: SessionEntry;
}
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api('/api/sessions'),
  });
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchTerm || !sessions) {
      return [];
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const results: SearchResult[] = [];
    sessions.forEach(session => {
      let sessionAdded = false;
      // Search in title, description, tags
      if (
        session.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        session.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        session.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
      ) {
        results.push({ session });
        sessionAdded = true;
      }
      // Search in entries
      session.entries.forEach(entry => {
        if (entry.content.toLowerCase().includes(lowerCaseSearchTerm)) {
          if (!sessionAdded) {
            results.push({ session, matchedEntry: entry });
          } else {
            // If session is already added, check if we can add this as a more specific match
            const existingResultIndex = results.findIndex(r => r.session.id === session.id);
            if (existingResultIndex !== -1 && !results[existingResultIndex].matchedEntry) {
              results[existingResultIndex].matchedEntry = entry;
            }
          }
        }
      });
    });
    return results;
  }, [searchTerm, sessions]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Search</h1>
          </div>
          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search across all sessions, entries, and tags..."
              className="pl-10 text-lg h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
          {!isLoading && searchTerm && searchResults.length === 0 && (
            <Card className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed">
              <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full">
                  <FileSearch className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-6 text-2xl font-semibold">No Results Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Try a different search term.
                </p>
              </CardContent>
            </Card>
          )}
          {!isLoading && searchResults.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{searchResults.length} result(s) found.</p>
              {searchResults.map(({ session, matchedEntry }) => (
                <SearchResultCard key={`${session.id}-${matchedEntry?.id || 'session'}`} session={session} matchedEntry={matchedEntry} searchTerm={searchTerm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}