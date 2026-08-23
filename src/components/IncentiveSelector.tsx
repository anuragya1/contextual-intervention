import { CashbackAmount, cashbackOptions, formatRupees } from "./data";

type IncentiveSelectorProps = {
  cashbackAmount: CashbackAmount;
  onChange: (amount: CashbackAmount) => void;
};

export function IncentiveSelector({ cashbackAmount, onChange }: IncentiveSelectorProps) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-900">Experiment: cashback incentive</p>
        <p className="text-xs leading-5 text-slate-500">Not production pricing. Tests the minimum perceived saving needed to switch.</p>
      </div>
      <div className="grid grid-cols-5 gap-1 rounded-lg bg-slate-100 p-1">
        {cashbackOptions.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(amount)}
            className={`rounded-md px-2 py-2 text-xs font-semibold transition ${
              cashbackAmount === amount
                ? "bg-white text-[#0f7d5a] shadow-sm"
                : "text-slate-600 hover:bg-white/70"
            }`}
          >
            {formatRupees(amount)}
          </button>
        ))}
      </div>
    </div>
  );
}
