import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { mockDiagnosis } from "@/lib/mockData";
import { CheckCircle2, XCircle, Send, Target, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BlindSpotReport = () => {
  const location = useLocation();
  const imageUrl = (location.state as { imageUrl?: string })?.imageUrl;
  const diagnosis = mockDiagnosis;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean | null>>({});

  const handleCheck = (id: number, correctAnswer: string) => {
    const userAnswer = answers[id]?.trim().toLowerCase() || "";
    const correct = correctAnswer.toLowerCase();
    // Simple check — contains the key expression
    setChecked((prev) => ({
      ...prev,
      [id]: correct.includes(userAnswer) || userAnswer.includes(correct.split(".")[0].trim().toLowerCase()),
    }));
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            BlindSpot <span className="text-primary text-glow-cyan">Report</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Forensic analysis complete. Here's what we found.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left: Uploaded image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="border-b border-border px-5 py-3">
              <p className="font-display text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Submitted Work
              </p>
            </div>
            <div className="flex items-center justify-center p-6 min-h-[300px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Submitted work"
                  className="max-h-96 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <BookOpen className="h-12 w-12" />
                  <p className="text-sm">No image uploaded. Go to Diagnostic Lab first.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: AI Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Error Tag */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-red/10 border border-neon-red/30">
                  <Target className="h-5 w-5 text-neon-red" />
                </div>
                <div>
                  <p className="font-display text-xs text-muted-foreground uppercase tracking-wider">
                    Error Detected
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-neon-red/10 px-3 py-1 text-sm font-semibold text-neon-red border border-neon-red/30">
                      {diagnosis.error_category}: {diagnosis.error_tag}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-neon-yellow" />
                <p className="font-display text-xs text-muted-foreground uppercase tracking-wider">
                  Diagnosis
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {diagnosis.explanation}
              </p>
            </div>

            {/* Drill Mode */}
            <div className="rounded-2xl border border-primary/20 bg-card p-6 border-glow-cyan">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="font-display text-sm font-semibold text-primary">
                  The Antidote — Drill Mode
                </p>
              </div>
              <div className="space-y-5">
                {diagnosis.practice_problems.map((prob, i) => (
                  <motion.div
                    key={prob.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-foreground">
                      <span className="font-display text-xs text-primary mr-2">
                        Q{i + 1}.
                      </span>
                      {prob.question}
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your answer..."
                        value={answers[prob.id] || ""}
                        onChange={(e) =>
                          setAnswers((p) => ({ ...p, [prob.id]: e.target.value }))
                        }
                        className="bg-secondary border-border font-body text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCheck(prob.id, prob.answer)}
                        className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    {checked[prob.id] !== undefined && checked[prob.id] !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
                          checked[prob.id]
                            ? "bg-neon-green/10 border border-neon-green/20 text-neon-green"
                            : "bg-neon-red/10 border border-neon-red/20 text-neon-red"
                        }`}
                      >
                        {checked[prob.id] ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {checked[prob.id]
                            ? "Correct! You're patching the blind spot."
                            : `Not quite. Expected: ${prob.answer}`}
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlindSpotReport;
