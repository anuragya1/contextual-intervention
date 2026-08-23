import { BadgeIndianRupee, CreditCard, LockKeyhole, MapPin, PackageCheck, ShieldCheck } from "lucide-react";
import { formatRupees, product } from "./data";

type PaymentPageProps = {
  quantity: number;
  onBackToProduct: () => void;
  isCashbackTracked?: boolean;
  cashbackAmount: number;
};

const deliveryFee = 0;

export function PaymentPage({ quantity, onBackToProduct, isCashbackTracked = false, cashbackAmount }: PaymentPageProps) {
  const itemTotal = product.price * quantity;
  const orderTotal = itemTotal + deliveryFee;
  const totalCashback = cashbackAmount * quantity;
  const effectiveOrderTotal = orderTotal - totalCashback;

  return (
    <div className="min-h-[760px] bg-[#f6f8fa]">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <div className="text-xl font-black tracking-normal text-[#1f3b49]">ShopNow</div>
            <p className="text-xs font-medium text-slate-500">Secure payment</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f0fbf6] px-3 py-1.5 text-xs font-bold text-[#0f7d5a]">
            <LockKeyhole className="h-3.5 w-3.5" />
            Protected checkout
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-8">
        <section className="space-y-4">
          {isCashbackTracked ? (
            <div className="rounded-lg border border-[#b8ead6] bg-[#f0fbf6] p-4 shadow-sm sm:p-5">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#0f7d5a] text-white">
                  <BadgeIndianRupee className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-black text-slate-950">CashKaro tracking active</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    Continue your ShopNow payment. {formatRupees(totalCashback)} cashback is activated across {quantity} item{quantity > 1 ? "s" : ""}, making the effective order value {formatRupees(effectiveOrderTotal)}.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#1f76a6]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h1 className="text-xl font-black tracking-normal text-slate-950">Payment</h1>
                  <button
                    type="button"
                    onClick={onBackToProduct}
                    className="rounded-md px-2 py-1 text-sm font-semibold text-[#1f76a6] hover:bg-[#eef7fb]"
                  >
                    Back to product
                  </button>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Delivering to Priya Sharma, 221B Market Road, Bengaluru 560001.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3">
              <PackageCheck className="mt-1 h-5 w-5 shrink-0 text-[#0f7d5a]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-500">Order item</p>
                <h2 className="mt-1 text-lg font-black tracking-normal text-slate-950">{product.name}</h2>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                  <Info label="Quantity" value={`${quantity}`} />
                  <Info label="Delivery" value="Tomorrow" />
                  <Info label="Retailer price" value={formatRupees(product.price)} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#1f76a6]" />
              <h2 className="text-lg font-black tracking-normal text-slate-950">Choose payment method</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["UPI", "Credit / Debit Card", "Net banking", "Cash on delivery"].map((method, index) => (
                <label
                  key={method}
                  className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <input
                    className="h-4 w-4 accent-[#1f3b49]"
                    defaultChecked={index === 0}
                    name="payment-method"
                    type="radio"
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#0f7d5a]" />
            <h2 className="text-lg font-black tracking-normal text-slate-950">Order summary</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Item total" value={formatRupees(itemTotal)} />
            <Row label="Delivery" value="Free" />
            {isCashbackTracked ? <Row label={`CashKaro cashback (${quantity} x ${formatRupees(cashbackAmount)})`} value={`-${formatRupees(totalCashback)}`} accent /> : null}
            <div className="border-t border-slate-200 pt-3">
              <Row label="Amount payable" value={formatRupees(orderTotal)} strong />
            </div>
            {isCashbackTracked ? (
              <div className="rounded-md bg-[#f0fbf6] p-3">
                <Row label="Effective after cashback" value={formatRupees(effectiveOrderTotal)} strong accent />
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="mt-5 min-h-12 w-full rounded-md bg-[#1f3b49] px-4 py-3 font-black text-white transition hover:bg-[#172c37]"
          >
            Pay {formatRupees(effectiveOrderTotal)}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {isCashbackTracked
              ? "Cashback is tracked separately by the simulated CashKaro path; ShopNow payment context is preserved."
              : "This is the high-intent payment moment where the prototype surfaces CashKaro contextually."}
          </p>
        </aside>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Row({ label, value, strong = false, accent = false }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  const valueClass = strong
    ? `text-xl font-black ${accent ? "text-[#0f7d5a]" : "text-slate-950"}`
    : `font-semibold ${accent ? "text-[#0f7d5a]" : "text-slate-900"}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <span className={strong ? "font-bold text-slate-950" : "text-slate-600"}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
