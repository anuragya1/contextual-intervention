import { Check } from "lucide-react";

type StepListProps = {
  steps: string[];
};

export function StepList({ steps }: StepListProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={step} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#0f7d5a] text-white">
              <Check className="h-4 w-4" />
            </span>
            {index < steps.length - 1 ? <span className="h-6 w-px bg-slate-200" /> : null}
          </div>
          <p className="pt-1 text-sm font-semibold text-slate-800">{step}</p>
        </div>
      ))}
    </div>
  );
}
