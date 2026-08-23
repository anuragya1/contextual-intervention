export const product = {
  name: "Wireless Noise Cancelling Headphones",
  retailer: "ShopNow",
  price: 1999,
  originalPrice: 2499,
  rating: 4.5,
  reviews: 2341,
  url: "shopnow.example/products/headphones"
};

export const cashbackOptions = [50, 100, 150, 250, 300] as const;

export type CashbackAmount = (typeof cashbackOptions)[number];
export type ShoppingSignal = "browsing" | "selected" | "high-intent";
export type DemoState = "shopping" | "intervention" | "activated" | "context-preserved" | "tracked";
export type RetailerView = "product" | "payment";

export function formatRupees(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}
