import { mockRecentErrors } from "@/lib/mockData";
import { motion } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";

const RecentBlindspots = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-foreground">
        Recent BlindSpots
      </h2>
      <div className="space-y-3">
        {mockRecentErrors.map((error, i) => (
          <motion.div
            key={error.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-surface-elevated"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neon-red/10 border border-neon-red/30">
              <AlertTriangle className="h-5 w-5 text-neon-red" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                  {error.error_category}
                </span>
                <span className="text-xs text-muted-foreground">{error.subject}</span>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {error.specific_error_tag}
              </p>
              <p className="text-xs text-muted-foreground">{error.topic}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {new Date(error.created_at).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentBlindspots;
