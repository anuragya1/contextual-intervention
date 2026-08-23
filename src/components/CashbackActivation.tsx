import { CheckCircle2 } from "lucide-react";
import { formatRupees, product } from "./data";
import { PriceMath } from "./PriceMath";
import { StepList } from "./StepList";

type CashbackActivationProps = {
  cashbackAmount: number;
  quantity: number;
  onContinue: () => void;
};

export function CashbackActivation({ cashbackAmount, quantity, onContinue }: CashbackActivationProps) {
  const totalCashback = cashbackAmount * quantity;
  const itemTotal = product.price * quantity;

  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/12 p-3 backdrop-blur-[2px]">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft animate-cardIn">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-[#0f7d5a]" />
          <div>
            <p className="text-xl font-black text-slate-950">{formatRupees(totalCashback)} cashback activated</p>
            <p className="text-sm text-slate-500">CashKaro captured the product context from ShopNow.</p>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-500">Product</p>
          <p className="mt-1 font-bold text-slate-950">{product.name}</p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Retailer</p>
              <p className="font-bold text-slate-950">{product.retailer}</p>
            </div>
            <div>
              <p className="text-slate-500">Retailer price</p>
              <p className="font-bold text-slate-950">{formatRupees(itemTotal)}</p>
            </div>
            <div>
              <p className="text-slate-500">Quantity</p>
              <p className="font-bold text-slate-950">{quantity}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <PriceMath cashbackAmount={cashbackAmount} compact quantity={quantity} />
        </div>

        <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-800">
          Your product context has been preserved.
        </p>
        <div className="mt-4">
          <StepList steps={["Product identified", "Cashback activated", "Continue shopping"]} />
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="mt-5 min-h-12 w-full rounded-md bg-[#1f3b49] px-4 py-3 font-bold text-white transition hover:bg-[#172c37]"
        >
          Continue
        </button>
      </section>
    </div>
  );
}
