import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Mail } from "lucide-react";
import { ReactNode } from "react";
const SupportCard = ({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) => (
  <Card className="text-center hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
        {icon}
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{children}</p>
    </CardContent>
  </Card>
);
export default function SupportPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Support</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              We're here to help. Find the resources you need to get the most out of TraceStack.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SupportCard icon={<BookOpen className="h-10 w-10 text-primary" />} title="Documentation">
              Browse our comprehensive guides and API references to learn everything about TraceStack.
            </SupportCard>
            <SupportCard icon={<Users className="h-10 w-10 text-primary" />} title="Community Forum">
              Ask questions, share solutions, and connect with other developers in our community forum.
            </SupportCard>
            <SupportCard icon={<Mail className="h-10 w-10 text-primary" />} title="Email Support">
              Can't find an answer? Send us an email and our support team will get back to you.
            </SupportCard>
          </div>
          <footer className="text-center py-16 text-muted-foreground text-sm mt-8">
            Built with ❤️ at Cloudflare
          </footer>
        </div>
      </div>
    </AppLayout>
  );
}