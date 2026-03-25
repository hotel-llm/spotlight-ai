import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, Microscope, Image as ImageIcon, ArrowRight, Lock, ScanLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EducatorLayout from "@/components/EducatorLayout";
import { checkScanCredits } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SCAN_STEPS = ["Uploading", "Analysis", "Mapping blindspots"] as const;

const DiagnosticLab = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const navigate = useNavigate();

  const analyzeImage = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);
      setScanStep(0);

      try {
        const credits = await checkScanCredits();
        if (!credits.allowed) {
          setIsAnalyzing(false);
          setRemainingCredits(credits.credits);
          setShowUpgradeModal(true);
          return;
        }

        const stepTimers = [window.setTimeout(() => setScanStep(1), 500), window.setTimeout(() => setScanStep(2), 1200)];

        const url = URL.createObjectURL(file);
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const { data, error } = await supabase.functions.invoke("diagnose-image", {
          body: { image: base64, mimeType: file.type },
        });

        stepTimers.forEach(clearTimeout);

        if (error) throw error;

        const inputStatus = (data as any)?.input_status as string | undefined;
        if (inputStatus && inputStatus !== "ok") {
          toast.error(
            inputStatus === "blurry"
              ? "Image is too blurry to read. Please retake a clearer photo."
              : "That doesn’t look like student STEM working. Please upload a clear PNG or JPG of the work."
          );
          setIsAnalyzing(false);
          setScanStep(0);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        await supabase.from("error_logs").insert({
          student_id: user?.id ?? null,
          subject: "STEM",
          topic: (data as any)?.error_tag ?? null,
          specific_error_tag: (data as any)?.error_tag ?? null,
          error_category: (data as any)?.error_category ?? null,
        });

        navigate("/report", { state: { imageUrl: url, diagnosis: data } });
      } catch (err: unknown) {
        console.error("Analysis failed:", err);
        toast.error(
          "Something went wrong while scanning. Check your connection and Supabase setup, then try again."
        );
        setIsAnalyzing(false);
        setScanStep(0);
      }
    },
    [navigate]
  );

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const canAnalyze = useMemo(() => !!selectedFile && !isAnalyzing, [selectedFile, isAnalyzing]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file (PNG or JPG).");
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreview(url);
  }, []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG or JPG).");
      return;
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreview(url);
  }, []);

  return (
    <EducatorLayout
      title="Diagnostic Lab"
      subtitle="Run a scan from the bay, then review the structured report."
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Diagnostic bay</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Well-lit photo, full page in frame, handwriting in focus. PNG or JPG up to ~10MB.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <ScanLine className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  Structured report + practice cues
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isAnalyzing) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  if (isAnalyzing) return;
                  onDrop(e);
                }}
                className={cn(
                  "group relative flex min-h-[14rem] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors sm:min-h-[16rem]",
                  isDragging ? "border-slate-400 bg-slate-50" : "border-slate-200 bg-slate-50/50 hover:border-slate-300",
                  isAnalyzing && "cursor-not-allowed opacity-70"
                )}
              >
                <input type="file" accept="image/*" className="hidden" onChange={onFileInput} disabled={isAnalyzing} />
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  {isDragging ? (
                    <Microscope className="h-9 w-9 text-slate-700" />
                  ) : (
                    <Upload className="h-9 w-9 text-slate-400 transition-colors group-hover:text-slate-600" />
                  )}
                  <div>
                    <p className="text-sm font-semibold tracking-tight text-slate-900">Place work in the bay</p>
                    <p className="mt-1 text-xs text-slate-600">Drop a file or tap to browse</p>
                  </div>
                </div>
              </label>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
                  <ImageIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{selectedFile ? selectedFile.name : "No image queued"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 bg-white"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setIsDragging(false);
                    }}
                    disabled={isAnalyzing || (!selectedFile && !preview)}
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      if (!selectedFile) {
                        toast.error("Select an image first.");
                        return;
                      }
                      analyzeImage(selectedFile);
                    }}
                    disabled={!canAnalyze}
                  >
                    <Microscope className="mr-2 h-4 w-4" />
                    Run scan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Specimen preview</p>
            </div>
            <div className="relative flex min-h-[280px] items-center justify-center p-4 sm:min-h-[360px] sm:p-6">
              {preview ? (
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={preview} alt="Work preview" className="max-h-[520px] w-full object-contain" />

                  <AnimatePresence>
                    {isAnalyzing ? (
                      <motion.div
                        className="absolute inset-0 flex flex-col justify-between bg-slate-950/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute inset-0 overflow-hidden">
                          <motion.div
                            className="absolute -inset-x-full inset-y-0 w-[200%] bg-gradient-to-r from-transparent via-white/75 to-transparent"
                            style={{ skewX: "-12deg" }}
                            animate={{ x: ["-20%", "20%"] }}
                            transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          <motion.div
                            className="absolute left-0 right-0 h-[42%] bg-gradient-to-b from-transparent via-indigo-300/25 to-transparent"
                            initial={{ top: "-45%" }}
                            animate={{ top: ["-45%", "105%"] }}
                            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                        </div>

                        <div className="relative z-10 m-3 rounded-lg border border-slate-200/80 bg-white/95 p-3 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                            <span className="text-xs font-semibold tracking-tight text-slate-900">
                              Scanning for blindspots…
                            </span>
                          </div>
                          <div className="mt-3 space-y-2">
                            {SCAN_STEPS.map((step, idx) => (
                              <div key={step} className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "h-2 w-2 rounded-full border transition-colors",
                                    idx <= scanStep ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-xs",
                                    idx <= scanStep ? "font-medium text-slate-900" : "text-slate-500"
                                  )}
                                >
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="relative z-10 m-3 space-y-2">
                          <div className="h-2 w-3/4 max-w-[220px] animate-pulse rounded bg-white/70" />
                          <div className="h-2 w-1/2 max-w-[160px] animate-pulse rounded bg-white/60" />
                          <div className="h-2 w-2/3 max-w-[200px] animate-pulse rounded bg-white/50" />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">Preview appears when you add an image.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="border border-slate-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Lock className="h-4 w-4 text-indigo-600" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              You’re out of scan credits
              {remainingCredits !== null ? ` (${remainingCredits} left)` : ""}. Upgrade to keep diagnosing without
              interruption.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Pro includes unlimited scans and full history—built for daily tutoring workflows.
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" className="border-slate-200 bg-white" onClick={() => setShowUpgradeModal(false)}>
              Not now
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate("/pricing")}>
              View plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </EducatorLayout>
  );
};

export default DiagnosticLab;
