import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DiagnosisResult } from "@/lib/mockData";
import { CheckCircle2, XCircle, Send, Target, Zap, BookOpen, ArrowLeft, FileSearch, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const getStatusCopy = (errorCategory: string) => {
  if (errorCategory.toLowerCase() === "conceptual") {
    return {
      label: "Conceptual Blindspot",
      classes: "bg-rose-50 text-rose-700 border-rose-200",
      hint: "Student likely needs concept re-teaching before more problem volume.",
    };
  }

  return {
    label: "Procedural Slip",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    hint: "Student understands core concept but needs process correction and repetition.",
  };
};

const BlindSpotReport = () => {
  const location = useLocation();
  const state = location.state as { imageUrl?: string; diagnosis?: DiagnosisResult } | null;
  const imageUrl = state?.imageUrl;
  const diagnosis = state?.diagnosis;

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean | null>>({});
  const status = getStatusCopy(diagnosis?.error_category ?? "procedural");

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
        <div className="mb-8 flex items-center gap-4">
          <Link to="/lab" className="text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diagnostic Report</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Student Misconception Analysis</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="border-slate-200 p-5 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-indigo-600" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Submitted Work</p>
            </div>
            <div className="flex items-center justify-center p-6 min-h-[300px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Submitted work"
                  className="max-h-96 w-full rounded-md border border-slate-200 object-contain"
                />
              ) : (
                <p className="text-sm text-muted-foreground">No image</p>
              )}
            </div>
          </Card>

          <div className="space-y-6 lg:col-span-2">
            <Card className="border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-indigo-600" />
                    <Badge className={`border text-xs font-semibold ${status.classes}`}>{status.label}</Badge>
                  </div>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {status.hint}
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Detected tag:</span> {diagnosis.error_tag}
              </p>
            </Card>

            <Card className="border-slate-200 p-6">
              <div className="mb-3 flex items-center gap-2">
                <TriangleAlert className="h-4 w-4 text-rose-600" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Why It’s Wrong</p>
              </div>
              <p className="text-lg font-semibold leading-relaxed text-slate-900 md:text-xl">
                {diagnosis.explanation}
              </p>
            </Card>

            <Card className="border-slate-200 p-5">
              <div className="mb-5 flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Learning Path (Fix)</p>
              </div>
              <div className="space-y-5">
                {diagnosis.practice_problems.map((prob, i) => (
                  <div key={prob.id} className="space-y-3 rounded-lg border border-slate-200 p-4">
                    <p className="text-sm text-slate-900">
                      <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
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
                        className="border-slate-300 bg-white text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCheck(prob.id, prob.answer)}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {checked[prob.id] !== undefined && checked[prob.id] !== null && (
                      <div
                        className={`flex items-start gap-2 rounded-md border p-3 text-xs ${
                          checked[prob.id]
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-rose-200 bg-rose-50 text-rose-700"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlindSpotReport;
