import { BrowserToolbar } from "./BrowserToolbar";
import { CashbackActivation } from "./CashbackActivation";
import { ContextPreservedProduct } from "./ContextPreservedProduct";
import { ContextualIntervention } from "./ContextualIntervention";
import { CashbackAmount, DemoState, product, RetailerView } from "./data";
import { PaymentPage } from "./PaymentPage";
import { ProductPage } from "./ProductPage";

type BrowserShellProps = {
  demoState: DemoState;
  cashbackAmount: CashbackAmount;
  quantity: number;
  cartCount: number;
  retailerView: RetailerView;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onBackToProduct: () => void;
  onActivate: () => void;
  onDismiss: () => void;
  onActivationContinue: () => void;
  onContextContinue: () => void;
};

export function BrowserShell({
  demoState,
  cashbackAmount,
  quantity,
  cartCount,
  retailerView,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onBackToProduct,
  onActivate,
  onDismiss,
  onActivationContinue,
  onContextContinue
}: BrowserShellProps) {
  const currentPath =
    retailerView === "payment" ? "shopnow.example/checkout/payment" : product.url;

  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-none border border-slate-200 bg-white shadow-soft sm:rounded-lg">
      <BrowserToolbar currentPath={currentPath} />
      <div className="relative h-[calc(100vh-48px)] min-h-[680px] overflow-y-auto overflow-x-hidden bg-white sm:h-[calc(100vh-84px)]">
        {retailerView === "payment" ? (
          <PaymentPage
            cashbackAmount={cashbackAmount}
            isCashbackTracked={demoState === "tracked"}
            onBackToProduct={onBackToProduct}
            quantity={quantity}
          />
        ) : (
          <ProductPage
            cartCount={cartCount}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
            onQuantityChange={onQuantityChange}
            quantity={quantity}
          />
        )}
        {demoState === "intervention" ? (
          <ContextualIntervention
            cashbackAmount={cashbackAmount}
            onActivate={onActivate}
            onDismiss={onDismiss}
            placement={retailerView === "payment" ? "payment" : "product"}
            quantity={quantity}
          />
        ) : null}
        {demoState === "activated" ? (
          <CashbackActivation cashbackAmount={cashbackAmount} onContinue={onActivationContinue} quantity={quantity} />
        ) : null}
        {demoState === "context-preserved" ? (
          <ContextPreservedProduct cashbackAmount={cashbackAmount} onContinue={onContextContinue} quantity={quantity} />
        ) : null}
      </div>
    </div>
  );
}
