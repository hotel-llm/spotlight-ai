import { Link } from "react-router-dom";
import { Camera, Microscope, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center md:px-10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Diagnostic teaching</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Fix the thinking, not just the answer.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Turn handwritten work into instant insight so you can fix the root misconceptions faster.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/lab">
              <Button className="h-12 bg-indigo-600 px-8 text-base font-semibold hover:bg-indigo-700">Start Scan</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="h-12 border-slate-200 bg-white px-8 text-base font-medium text-slate-900">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">How it works</h2>
            <p className="text-sm text-slate-600">From snapshot to a teaching plan in one flow</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Camera className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Step 1</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">Photo</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Capture notebook, worksheet, or board work in one frame.
              </p>
            </Card>

            <Card className="border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Microscope className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Step 2</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">Diagnosis</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Blindspot finds the issue and reveals the underlying concept.
              </p>
            </Card>

            <Card className="border border-slate-200 bg-white p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
                <Route className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Step 3</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">Next steps</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Students complete targeted practice to repair their blindspot.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-600 md:flex-row">
          <p>Built for students, teachers, and schools.</p>
          <Link to="/pricing" className="font-medium text-indigo-600 hover:text-indigo-700">
            Pricing
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
