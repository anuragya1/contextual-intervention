import { formatRupees, product } from "./data";

type PriceMathProps = {
  cashbackAmount: number;
  quantity?: number;
  compact?: boolean;
};

export function PriceMath({ cashbackAmount, quantity = 1, compact = false }: PriceMathProps) {
  const itemTotal = product.price * quantity;
  const totalCashback = cashbackAmount * quantity;
  const effectivePrice = itemTotal - totalCashback;

  return (
    <div className={`rounded-lg border border-[#b8ead6] bg-[#f0fbf6] ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0f7d5a]">Cashback opportunity</p>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-600">Retailer price</span>
          <span className="font-semibold text-slate-900">{formatRupees(itemTotal)}</span>
        </div>
        {quantity > 1 ? (
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">Quantity</span>
            <span className="font-semibold text-slate-900">{quantity}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-600">Cashback</span>
          <span className="font-semibold text-[#0f7d5a]">- {formatRupees(totalCashback)}</span>
        </div>
        <div className="border-t border-[#b8ead6] pt-2">
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-900">Effective price</span>
            <span className="text-xl font-black text-slate-950">{formatRupees(effectivePrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
