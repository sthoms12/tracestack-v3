import { ArrowRight, CheckCircle, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sora text-foreground">
      <ThemeToggle className="absolute top-6 right-6" />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#3b82f6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="text-gradient lowercase">tracestack</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Transform chaotic debugging into structured, searchable knowledge. A troubleshooting session management app for solo developers.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20">
                <Link to="/app/dashboard">
                  Enter App <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-16 flow-root sm:mt-24">
          <div className="rounded-md bg-card/50 p-2 ring-1 ring-inset ring-border/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="text-center p-8 border border-dashed rounded-lg">
              <Workflow className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-6 text-xl font-semibold">Multiple Workflow Views</h3>
              <p className="mt-2 text-muted-foreground">Timeline, Kanban, Raw Notes, and Brainstorm views to match your troubleshooting style.</p>
            </div>
          </div>
        </div>
        <footer className="text-center py-16 text-muted-foreground text-sm">
          Built with ❤️ at Cloudflare
        </footer>
      </div>
    </div>
  );
}