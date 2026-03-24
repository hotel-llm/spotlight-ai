import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Microscope } from "lucide-react";

const DiagnosticLab = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsAnalyzing(true);
      // Simulate AI analysis delay, then navigate to report
      setTimeout(() => {
        navigate("/report", { state: { imageUrl: url } });
      }, 2500);
    },
    [navigate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) handleFile(file);
    },
    [handleFile]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-16">
      <div className="container flex flex-col items-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Diagnostic <span className="text-primary text-glow-cyan">Lab</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload your incorrect working. We'll find the fracture point.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex flex-col items-center gap-6"
            >
              {preview && (
                <div className="relative h-48 w-48 overflow-hidden rounded-xl border border-primary/30">
                  <img src={preview} alt="Uploaded work" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-primary/5">
                    <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-scan-line" />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="font-display text-sm text-primary animate-pulse-glow">
                  Running forensic analysis...
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.label
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`group mt-12 flex h-80 w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5 border-glow-cyan"
                  : "border-border hover:border-primary/40 hover:bg-card"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileInput}
              />
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isDragging
                    ? "bg-primary/20 glow-cyan"
                    : "bg-secondary group-hover:bg-primary/10"
                }`}
              >
                {isDragging ? (
                  <Microscope className="h-8 w-8 text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
                )}
              </div>
              <p className="mt-4 font-display text-sm font-medium text-foreground">
                Drop your incorrect working here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Let's find the <span className="text-primary">BlindSpot</span>.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </motion.label>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DiagnosticLab;
