import KnowledgeHeatmap from "@/components/KnowledgeHeatmap";
import RecentBlindspots from "@/components/RecentBlindspots";
import { motion } from "framer-motion";
import { Activity, Target, TrendingDown } from "lucide-react";

const statCards = [
  { label: "Total Errors Logged", value: "73", icon: Target, accent: "text-primary" },
  { label: "Weakest Topic", value: "Stoichiometry", icon: TrendingDown, accent: "text-neon-red" },
  { label: "Active Streak", value: "5 days", icon: Activity, accent: "text-neon-green" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Your <span className="text-primary text-glow-cyan">BlindSpot</span> Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track your weaknesses. Eliminate them.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-display">
                  {label}
                </p>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
              <p className={`mt-2 text-2xl font-bold font-display ${accent}`}>
                {value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <KnowledgeHeatmap />
          </div>
          <div>
            <RecentBlindspots />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
