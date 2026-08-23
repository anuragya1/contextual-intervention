"use client";

import { useEffect, useState } from "react";
import { BrowserShell } from "@/components/BrowserShell";
import { CashbackAmount, DemoState, RetailerView, ShoppingSignal } from "@/components/data";
import { DemoControls } from "@/components/DemoControls";

export default function Home() {
  const [demoState, setDemoState] = useState<DemoState>("shopping");
  const [shoppingSignal, setShoppingSignal] = useState<ShoppingSignal>("browsing");
  const [cashbackAmount, setCashbackAmount] = useState<CashbackAmount>(250);
  const [retailerView, setRetailerView] = useState<RetailerView>("product");
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function handleSignalChange(signal: ShoppingSignal) {
    setShoppingSignal(signal);
    if (signal === "high-intent") {
      setRetailerView("payment");
      setDemoState("intervention");
      setToast("");
      return;
    }
    if (demoState === "intervention") {
      setDemoState("shopping");
    }
  }

  function handleDismiss() {
    setDemoState("shopping");
    setShoppingSignal("selected");
    setToast("Cashback opportunity dismissed.");
  }

  function handleBuyNow() {
    setCartCount((count) => Math.max(count, quantity));
    setRetailerView("payment");
    setShoppingSignal("high-intent");
    setDemoState("intervention");
    setToast("");
  }

  function handleBackToProduct() {
    setRetailerView("product");
    if (demoState === "intervention") {
      setDemoState("shopping");
      setShoppingSignal("selected");
    }
  }

  function handleReset() {
    setDemoState("shopping");
    setShoppingSignal("browsing");
    setRetailerView("product");
    setCashbackAmount(250);
    setQuantity(1);
    setCartCount(0);
    setToast("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-0 py-0 sm:px-4 sm:py-4 lg:px-6">
      <DemoControls
        cashbackAmount={cashbackAmount}
        demoState={demoState}
        isOpen={controlsOpen}
        onCashbackChange={setCashbackAmount}
        onReset={handleReset}
        onSignalChange={handleSignalChange}
        onToggle={() => setControlsOpen((open) => !open)}
        signal={shoppingSignal}
      />

      <BrowserShell
        cartCount={cartCount}
        cashbackAmount={cashbackAmount}
        demoState={demoState}
        onActivate={() => {
          setDemoState("activated");
          setShoppingSignal("high-intent");
        }}
        onActivationContinue={() => setDemoState("context-preserved")}
        onAddToCart={() => {
          setCartCount((count) => count + quantity);
          setShoppingSignal("selected");
          setToast("Added to cart. Buy Now moves this prototype to payment.");
        }}
        onBackToProduct={handleBackToProduct}
        onBuyNow={handleBuyNow}
        onContextContinue={() => {
          setRetailerView("payment");
          setDemoState("tracked");
          setToast("Returned to ShopNow with CashKaro tracking active.");
        }}
        onDismiss={handleDismiss}
        onQuantityChange={setQuantity}
        quantity={quantity}
        retailerView={retailerView}
      />

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-lift animate-toastIn">
          {toast}
        </div>
      ) : null}
    </main>
  );
}
