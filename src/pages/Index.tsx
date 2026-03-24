import { Link } from "react-router-dom";
import { Camera, Microscope, Route, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-medium text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered intervention for educators
          </p>
          <h1 className="mt-6 text-balance text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
            Stop guessing why they’re stuck. Scan math. Find the blindspot.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Turn handwritten work into instant diagnostic insight so you can fix root misconceptions faster.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/lab">
              <Button className="h-14 px-10 text-base font-bold shadow-lg shadow-indigo-500/25">
                <Microscope className="mr-2 h-5 w-5" />
                Start Scan
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-14 px-8 text-base font-semibold">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">How It Works</h2>
            <p className="text-sm font-medium text-slate-500">From snapshot to intervention in minutes</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-slate-200 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Camera className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step 1</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Photo</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Take a snapshot of student working from notebook, worksheet, or whiteboard.
              </p>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50/40 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Step 2</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">AI Analysis</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                BlindSpot pinpoints the exact logic break and labels the misconception clearly.
              </p>
            </Card>

            <Card className="border-slate-200 p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Route className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step 3</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Learning Path</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Get targeted practice prompts so students repair the blindspot and move forward confidently.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground md:flex-row">
          <p>Built for tutors, teachers, and intervention teams.</p>
          <Link to="/pricing" className="font-medium text-indigo-600 hover:text-indigo-700">
            Pricing
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
