import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { CashbackAmount, DemoState, ShoppingSignal } from "./data";
import { IncentiveSelector } from "./IncentiveSelector";

type DemoControlsProps = {
  isOpen: boolean;
  onToggle: () => void;
  signal: ShoppingSignal;
  demoState: DemoState;
  cashbackAmount: CashbackAmount;
  onSignalChange: (signal: ShoppingSignal) => void;
  onCashbackChange: (amount: CashbackAmount) => void;
  onReset: () => void;
};

const signalOptions: Array<{ value: ShoppingSignal; label: string }> = [
  { value: "browsing", label: "Browsing" },
  { value: "selected", label: "Product selected" },
  { value: "high-intent", label: "High-intent moment" }
];

export function DemoControls({
  isOpen,
  onToggle,
  signal,
  demoState,
  cashbackAmount,
  onSignalChange,
  onCashbackChange,
  onReset
}: DemoControlsProps) {
  return (
    <div className="fixed right-3 top-3 z-40 w-[calc(100vw-1.5rem)] max-w-sm sm:right-6 sm:top-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-lift transition hover:border-slate-300"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#e43d4f]" />
          Demo Controls
        </button>
      </div>
      {isOpen ? (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-950">Demo Controls</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Demo simulation — represents the intent signal that would be validated during MVP development.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {demoState.replace("-", " ")}
            </span>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-900">Shopping state</legend>
            {signalOptions.map((option) => (
              <label
                key={option.value}
                className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <input
                  checked={signal === option.value}
                  className="h-4 w-4 accent-[#e43d4f]"
                  name="shopping-state"
                  onChange={() => onSignalChange(option.value)}
                  type="radio"
                />
                {option.label}
              </label>
            ))}
          </fieldset>

          <div className="my-4 h-px bg-slate-200" />
          <IncentiveSelector cashbackAmount={cashbackAmount} onChange={onCashbackChange} />
          <button
            type="button"
            onClick={onReset}
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset demo
          </button>
        </div>
      ) : null}
    </div>
  );
}
