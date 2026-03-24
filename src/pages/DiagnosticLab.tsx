import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, Microscope, Image as ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EducatorLayout from "@/components/EducatorLayout";

const DiagnosticLab = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const analyzeImage = useCallback(
    async (file: File) => {
      setIsAnalyzing(true);

      try {
        const url = URL.createObjectURL(file);
        // Convert to base64
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const { data, error } = await supabase.functions.invoke("diagnose-image", {
          body: { image: base64, mimeType: file.type },
        });

        if (error) throw error;

        // Graceful handling for blurry / non-STEM inputs (if returned by backend).
        const inputStatus = (data as any)?.input_status as string | undefined;
        if (inputStatus && inputStatus !== "ok") {
          toast.error(
            inputStatus === "blurry"
              ? "Image is too blurry to read. Please retake a clearer photo."
              : "That doesn’t look like student STEM working. Please upload a clear photo of the work."
          );
          setIsAnalyzing(false);
          return;
        }

        navigate("/report", { state: { imageUrl: url, diagnosis: data } });
      } catch (err: any) {
        console.error("Analysis failed:", err);
        toast.error(
          "Analysis failed. If you uploaded a clear photo of math/science work, check your API key and Supabase function logs."
        );
        setIsAnalyzing(false);
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

  const onDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    []
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file (PNG or JPG).");
        return;
      }

      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreview(url);
    },
    []
  );

  return (
    <EducatorLayout
      title="Diagnostic Lab"
      subtitle="Upload student working. We pinpoint the exact fracture point."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                    Upload
                  </p>
                  <p className="mt-1 text-sm text-foreground/90">
                    Best results: bright lighting, page fills the frame, handwriting in focus.
                  </p>
                </div>
                <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                  <Sparkles className="h-4 w-4" />
                  Structured diagnosis + 3 drills
                </div>
              </div>
            </div>

            <div className="p-6">
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
                  "group relative flex h-72 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors",
                  isDragging ? "border-foreground bg-accent" : "border-border hover:border-muted-foreground",
                  isAnalyzing && "cursor-not-allowed opacity-60"
                )}
              >
                <input type="file" accept="image/*" className="hidden" onChange={onFileInput} disabled={isAnalyzing} />
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  {isDragging ? (
                    <Microscope className="h-9 w-9 text-foreground" />
                  ) : (
                    <Upload className="h-9 w-9 text-muted-foreground transition-colors group-hover:text-foreground" />
                  )}
                  <div>
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
                      Drop an image or click to choose
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">PNG, JPG — up to 10MB</p>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px]">
                    <div className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                        Analyzing…
                      </span>
                    </div>
                  </div>
                ) : null}
              </label>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span className="truncate">
                    {selectedFile ? selectedFile.name : "No image selected yet"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setIsDragging(false);
                    }}
                    disabled={isAnalyzing || (!selectedFile && !preview)}
                    className="font-display text-xs uppercase tracking-wider"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!selectedFile) {
                        toast.error("Select an image first.");
                        return;
                      }
                      analyzeImage(selectedFile);
                    }}
                    disabled={!canAnalyze}
                    className="font-display text-xs uppercase tracking-wider gap-2"
                  >
                    <Microscope className="h-4 w-4" />
                    Analyze
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-5 py-3">
              <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                Preview
              </p>
            </div>
            <div className="flex min-h-[360px] items-center justify-center p-6">
              {preview ? (
                <img src={preview} alt="Selected work" className="max-h-[520px] w-full object-contain" />
              ) : (
                <div className="text-center space-y-2">
                  <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Select an image to preview it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EducatorLayout>
  );
};

export default DiagnosticLab;
