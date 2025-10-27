import { ArrowRight, BarChart, BrainCircuit, Clock, Combine, FileText, LayoutGrid, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/landing/FeatureCard';
import HowItWorksStep from '@/components/landing/HowItWorksStep';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
const features = [
  { icon: Clock, title: "Timeline View", description: "Chronological troubleshooting log with status indicators and entry editing." },
  { icon: LayoutGrid, title: "Kanban View", description: "Visual workflow management with drag-and-drop status updates." },
  { icon: FileText, title: "Raw Notes View", description: "Rapid, unstructured capture with auto-parsing for commands and quick conversion to structured entries." },
  { icon: BrainCircuit, title: "Brainstorm View", description: "Ideation and hypothesis generation with quick conversion to actionable entries." },
  { icon: Target, title: "Hypothesis Tracker", description: "Systematic debugging with confidence levels, test plans, and evidence tracking." },
  { icon: Combine, title: "Unified View", description: "Integrated perspective combining timeline, hypotheses, and key metrics for comprehensive analysis." },
  { icon: Search, title: "Global Search", description: "Full-text search across all sessions, entries, and hypotheses with highlighting and filters." },
  { icon: BarChart, title: "Smart Analytics", description: "Rule-based pattern recognition, actionable insights, and visualizations for resolution time and trends." },
];
const steps = [
  { step: 1, title: "Create Session", description: "Start a new troubleshooting session with details about the issue, environment, and error codes." },
  { step: 2, title: "Document Steps", description: "Add timestamped entries with notes, commands, screenshots, and outcomes as you work." },
  { step: 3, title: "Search & Learn", description: "Use the assistant to find patterns, get summaries, and quickly locate past solutions." },
];
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sora text-foreground overflow-x-hidden">
      <ThemeToggle className="absolute top-6 right-6 z-50" />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#10b981] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <p className="text-lg font-semibold leading-8 text-primary">For IT Professionals & Developers</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Never lose track of your troubleshooting again
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              <span className="text-gradient lowercase font-semibold">tracestack</span> helps technical professionals document, organize, and revisit complex troubleshooting sessions. Build a searchable knowledge base of solutions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20">
                <Link to="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl text-center -mt-16 sm:-mt-24 lg:-mt-32">
          <p className="text-lg italic text-muted-foreground">"It's not just a logbook; it's a thinking companion for your IT troubleshooting"</p>
        </div>
        <section id="features" className="py-24 sm:py-32">
          <motion.div
            className="mx-auto max-w-7xl px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for systematic debugging</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Multiple views adapt to your workflow, helping you move from chaos to clarity.
              </p>
            </div>
            <motion.div
              className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section id="how-it-works" className="py-24 sm:py-32 bg-secondary/50 rounded-2xl">
          <motion.div
            className="mx-auto max-w-7xl px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How tracestack works</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A simple, powerful loop to capture and reuse your technical knowledge.
              </p>
            </div>
            <motion.div
              className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl"
              variants={containerVariants}
            >
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
                {steps.map((step) => (
                  <HowItWorksStep key={step.step} {...step} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section id="solo-workflow" className="py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Designed for the Solo Workflow</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              tracestack is built for individual technical professionals. No team setup, no roles—just your personal troubleshooting knowledge base, powered by smart analytics and multiple workflow views.
            </p>
          </div>
        </section>
        <footer className="text-center py-16 text-muted-foreground text-sm">
          Built with ❤️ at Cloudflare
        </footer>
      </div>
    </div>
  );
}