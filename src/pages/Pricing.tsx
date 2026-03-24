import { Check, CreditCard, School, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "0",
    cadence: "/month",
    subtitle: "For quick trial and first classroom workflows",
    features: ["3 scans/day", "Core diagnostic report", "Single user access"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    price: "9.99",
    cadence: "/month",
    subtitle: "Best for active tutors and classroom intervention",
    features: ["Unlimited scans", "History sidebar", "Priority analysis queue"],
    cta: "Upgrade with Stripe",
    featured: true,
  },
  {
    name: "Tutor",
    price: "49",
    cadence: "/month",
    subtitle: "For growing practices and multi-student support",
    features: ["Student dashboard", "Unlimited scans", "Intervention insights"],
    cta: "Start Tutor Plan",
    featured: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="container py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-xs font-medium text-indigo-700">
            <CreditCard className="h-3.5 w-3.5" />
            Stripe-ready pricing placeholders
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900">Pricing for Every Teaching Stage</h1>
          <p className="mt-4 text-lg text-slate-600">
            Start free, scale when you need deeper diagnostics and student-level tracking.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col border p-6 ${
                plan.featured ? "border-indigo-300 bg-indigo-50/40 shadow-lg shadow-indigo-200/40" : "border-slate-200"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                {plan.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </span>
                ) : null}
              </div>

              <p className="text-sm text-slate-600">{plan.subtitle}</p>
              <div className="mt-5">
                <span className="text-4xl font-black text-slate-900">${plan.price}</span>
                <span className="ml-1 text-sm text-slate-500">{plan.cadence}</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700">
                <School className="mr-2 h-4 w-4" />
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
