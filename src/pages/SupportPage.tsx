import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";
export default function SupportPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Support</h1>
          </div>
          <Card className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed">
            <CardHeader>
              <div className="mx-auto bg-secondary p-4 rounded-full">
                <LifeBuoy className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle className="mt-6 text-2xl font-semibold">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Support channels and documentation will be linked here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}