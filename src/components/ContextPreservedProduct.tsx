import { ArrowRight, BadgeIndianRupee } from "lucide-react";
import { formatRupees, product } from "./data";

type ContextPreservedProductProps = {
  cashbackAmount: number;
  quantity: number;
  onContinue: () => void;
};

export function ContextPreservedProduct({ cashbackAmount, quantity, onContinue }: ContextPreservedProductProps) {
  const itemTotal = product.price * quantity;
  const totalCashback = cashbackAmount * quantity;
  const effectivePrice = itemTotal - totalCashback;

  return (
    <div className="absolute inset-0 z-30 overflow-y-auto bg-[#f6f8fa] p-4 sm:p-6">
      <section className="mx-auto flex min-h-full max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft lg:grid-cols-[0.8fr_1.2fr]">
          <div className="bg-[#203541] p-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-bold">
              <BadgeIndianRupee className="h-4 w-4" />
              CashKaro continuation
            </div>
            <h2 className="mt-8 text-3xl font-black leading-tight tracking-normal">Your product is ready</h2>
            <p className="mt-4 text-sm leading-6 text-slate-200">You don&apos;t need to restart your product search.</p>
            <div className="mt-8 rounded-lg border border-white/15 bg-white/8 p-4 text-sm">
              <p className="font-semibold text-white">Proposed behaviour</p>
              <div className="mt-3 space-y-2 text-slate-200">
                <p>Existing shopping journey</p>
                <p>CashKaro intervenes</p>
                <p>Activate</p>
                <p>Context preserved</p>
                <p>Continue</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#0f7d5a]">Preserved product context</p>
            <h3 className="mt-3 text-2xl font-black tracking-normal text-slate-950">{product.name}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Info label="Retailer" value={product.retailer} />
              <Info label="Retailer price" value={formatRupees(itemTotal)} />
              <Info label="Quantity" value={`${quantity}`} />
              <Info label="Cashback" value={`${formatRupees(totalCashback)} cashback`} accent />
              <Info label="Effective price" value={formatRupees(effectivePrice)} />
            </div>
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Current behaviour avoided</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The prototype skips the search-again loop and carries the selected ShopNow product into the tracked CashKaro path.
              </p>
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#e43d4f] px-4 py-3 font-black text-white transition hover:bg-[#c92f42] sm:w-auto"
            >
              Continue to ShopNow
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-black ${accent ? "text-[#0f7d5a]" : "text-slate-950"}`}>{value}</p>
    </div>
  );
}
