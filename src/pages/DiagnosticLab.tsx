import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, Microscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DiagnosticLab = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const analyzeImage = useCallback(
    async (file: File) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsAnalyzing(true);

      try {
        // Convert to base64
        const buffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );

        const { data, error } = await supabase.functions.invoke("diagnose-image", {
          body: { image: base64, mimeType: file.type },
        });

        if (error) throw error;

        navigate("/report", { state: { imageUrl: url, diagnosis: data } });
      } catch (err: any) {
        console.error("Analysis failed:", err);
        toast.error("Analysis failed. Check your API key configuration.");
        setIsAnalyzing(false);
      }
    },
    [navigate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) analyzeImage(file);
    },
    [analyzeImage]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) analyzeImage(file);
    },
    [analyzeImage]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-14">
      <div className="container flex flex-col items-center py-12">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Diagnostic Lab
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload incorrect working. We find the fracture point.
          </p>
        </div>

        {isAnalyzing ? (
          <div className="mt-12 flex flex-col items-center gap-6">
            {preview && (
              <div className="h-48 w-48 border border-border overflow-hidden">
                <img src={preview} alt="Uploaded work" className="h-full w-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-foreground" />
              <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                Analyzing...
              </span>
            </div>
          </div>
        ) : (
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`group mt-12 flex h-72 w-full max-w-lg cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors ${
              isDragging
                ? "border-foreground bg-accent"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInput}
            />
            <div className="flex flex-col items-center gap-4">
              {isDragging ? (
                <Microscope className="h-8 w-8 text-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
              <div className="text-center">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
                  Drop file here
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  PNG, JPG — up to 10MB
                </p>
              </div>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};

export default DiagnosticLab;
