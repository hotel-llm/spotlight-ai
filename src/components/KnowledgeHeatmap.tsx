import { mockMasteryData, getMasteryColor } from "@/lib/mockData";
import { motion } from "framer-motion";

const colorMap = {
  red: {
    bg: "bg-neon-red/10",
    border: "border-neon-red/30",
    text: "text-neon-red",
    glow: "glow-red",
    bar: "bg-neon-red",
  },
  yellow: {
    bg: "bg-neon-yellow/10",
    border: "border-neon-yellow/30",
    text: "text-neon-yellow",
    glow: "glow-yellow",
    bar: "bg-neon-yellow",
  },
  green: {
    bg: "bg-neon-green/10",
    border: "border-neon-green/30",
    text: "text-neon-green",
    glow: "glow-green",
    bar: "bg-neon-green",
  },
};

const KnowledgeHeatmap = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Knowledge Heatmap
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-neon-red" /> Weak
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-neon-yellow" /> Developing
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-neon-green" /> Mastered
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {mockMasteryData.map((item, i) => {
          const color = getMasteryColor(item.score);
          const styles = colorMap[color];
          return (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${styles.bg} ${styles.border} transition-all hover:scale-[1.02]`}
            >
              <p className="font-display text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.subject}
              </p>
              <p className={`mt-1 text-sm font-semibold ${styles.text}`}>
                {item.topic}
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                  className={`h-full rounded-full ${styles.bar}`}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.score}%</span>
                <span>{item.errorCount} errors</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeHeatmap;
