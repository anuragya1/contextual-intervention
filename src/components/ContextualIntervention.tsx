import { BadgeIndianRupee, X } from "lucide-react";
import { formatRupees, product } from "./data";
import { PriceMath } from "./PriceMath";

type ContextualInterventionProps = {
  cashbackAmount: number;
  quantity: number;
  onActivate: () => void;
  onDismiss: () => void;
  placement?: "product" | "payment";
};

function InterventionContent({ cashbackAmount, quantity, onActivate, onDismiss }: Omit<ContextualInterventionProps, "placement">) {
  const totalCashback = cashbackAmount * quantity;
  const totalPrice = product.price * quantity;

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#e43d4f] text-white">
            <BadgeIndianRupee className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">CashKaro</p>
            <p className="text-xs text-slate-500">Contextual cashback</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="grid h-8 w-8 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Dismiss cashback opportunity"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-black leading-tight tracking-normal text-slate-950">
          You can save {formatRupees(totalCashback)} on this purchase
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">You&apos;re about to buy this for {formatRupees(totalPrice)}.</p>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-900">
          Activate through CashKaro and get {formatRupees(totalCashback)} cashback.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We&apos;ll help you continue with this product, no need to restart your search.
        </p>
      </div>

      <div className="mt-4">
        <PriceMath cashbackAmount={cashbackAmount} compact quantity={quantity} />
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={onActivate}
          className="min-h-12 w-full rounded-md bg-[#e43d4f] px-4 py-3 text-sm font-black text-white shadow-lift transition hover:bg-[#c92f42]"
        >
          Activate {formatRupees(totalCashback)} Cashback
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-11 w-full rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Not now
        </button>
      </div>
    </>
  );
}

export function ContextualIntervention({ placement = "product", ...props }: ContextualInterventionProps) {
  const desktopPosition =
    placement === "payment"
      ? "right-5 top-[188px] lg:right-[390px] xl:right-[420px]"
      : "right-5 top-[330px] lg:right-8";

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-0 md:hidden">
        <section className="pointer-events-auto max-h-[66vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 shadow-soft animate-sheetUp">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
          <InterventionContent {...props} />
        </section>
      </div>
      <aside className={`pointer-events-auto absolute z-20 hidden w-[360px] rounded-lg border border-slate-200 bg-white p-5 shadow-soft animate-cardIn md:block ${desktopPosition}`}>
        <InterventionContent {...props} />
      </aside>
    </>
  );
}
