import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DiagnosisResult } from "@/lib/mockData";
import { CheckCircle2, XCircle, Send, Target, Zap, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BlindSpotReport = () => {
  const location = useLocation();
  const state = location.state as { imageUrl?: string; diagnosis?: DiagnosisResult } | null;
  const imageUrl = state?.imageUrl;
  const diagnosis = state?.diagnosis;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean | null>>({});

  const handleCheck = (id: number, correctAnswer: string) => {
    const userAnswer = answers[id]?.trim().toLowerCase() || "";
    const correct = correctAnswer.toLowerCase();
    setChecked((prev) => ({
      ...prev,
      [id]: correct.includes(userAnswer) || userAnswer.includes(correct.split(".")[0].trim().toLowerCase()),
    }));
  };

  if (!diagnosis) {
    return (
      <div className="min-h-screen bg-background pt-14 flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
            No report available
          </p>
          <p className="text-sm text-muted-foreground">
            Upload an image in the Lab first.
          </p>
          <Link to="/lab">
            <Button variant="outline" className="font-display text-xs uppercase tracking-wider gap-2 mt-4">
              <ArrowLeft className="h-3.5 w-3.5" />
              Go to Lab
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14 pb-12">
      <div className="container py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/lab" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Report
          </h1>
        </div>

        <div className="grid gap-px bg-border lg:grid-cols-2">
          {/* Left: Uploaded image */}
          <div className="bg-card">
            <div className="border-b border-border px-5 py-3">
              <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Submitted Work
              </p>
            </div>
            <div className="flex items-center justify-center p-6 min-h-[300px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Submitted work"
                  className="max-h-96 w-full object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No image</p>
              )}
            </div>
          </div>

          {/* Right: AI Breakdown */}
          <div className="bg-card">
            {/* Error Tag */}
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-signal-red" />
                <div>
                  <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                    Error Detected
                  </p>
                  <span className="mt-1 inline-flex border border-signal-red px-2 py-0.5 text-xs font-display uppercase tracking-wider text-signal-red">
                    {diagnosis.error_category}: {diagnosis.error_tag}
                  </span>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="border-b border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-3.5 w-3.5 text-signal-yellow" />
                <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                  Diagnosis
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {diagnosis.explanation}
              </p>
            </div>

            {/* Drill Mode */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-3.5 w-3.5 text-foreground" />
                <p className="font-display text-[10px] font-bold uppercase tracking-widest text-foreground">
                  Drill Mode
                </p>
              </div>
              <div className="space-y-5">
                {diagnosis.practice_problems.map((prob, i) => (
                  <div key={prob.id} className="space-y-3">
                    <p className="text-sm text-foreground">
                      <span className="font-display text-[10px] text-muted-foreground mr-2 uppercase">
                        Q{i + 1}
                      </span>
                      {prob.question}
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Your answer..."
                        value={answers[prob.id] || ""}
                        onChange={(e) =>
                          setAnswers((p) => ({ ...p, [prob.id]: e.target.value }))
                        }
                        className="bg-secondary border-border font-body text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCheck(prob.id, prob.answer)}
                        className="shrink-0"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {checked[prob.id] !== undefined && checked[prob.id] !== null && (
                      <div
                        className={`flex items-start gap-2 border p-3 text-xs ${
                          checked[prob.id]
                            ? "border-signal-green text-signal-green"
                            : "border-signal-red text-signal-red"
                        }`}
                      >
                        {checked[prob.id] ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {checked[prob.id]
                            ? "Correct."
                            : `Expected: ${prob.answer}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindSpotReport;
