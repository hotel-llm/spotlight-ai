import KnowledgeHeatmap from "@/components/KnowledgeHeatmap";
import RecentBlindspots from "@/components/RecentBlindspots";
import { Link } from "react-router-dom";
import { Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Empty arrays — will be populated from DB later
  const masteryData: any[] = [];
  const recentErrors: any[] = [];

  const totalErrors = 0;
  const weakestTopic = "—";
  const streak = "—";

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="container py-10 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track weaknesses. Eliminate them.
            </p>
          </div>
          <Link to="/lab">
            <Button variant="outline" className="font-display text-xs uppercase tracking-wider gap-2">
              <Microscope className="h-3.5 w-3.5" />
              New Scan
            </Button>
          </Link>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {[
            { label: "Total Errors", value: totalErrors || "—" },
            { label: "Weakest Topic", value: weakestTopic },
            { label: "Streak", value: streak },
          ].map(({ label, value }) => (
            <div key={label} className="bg-card p-5">
              <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold font-display text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <KnowledgeHeatmap data={masteryData} />
          </div>
          <div>
            <RecentBlindspots data={recentErrors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
