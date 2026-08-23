import { Heart, Minus, Plus, Search, ShoppingCart, Star, Truck } from "lucide-react";
import { formatRupees, product } from "./data";
import { ProductVisual } from "./ProductVisual";

type ProductPageProps = {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  cartCount: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

export function ProductPage({ quantity, onQuantityChange, cartCount, onAddToCart, onBuyNow }: ProductPageProps) {
  return (
    <div className="min-h-[760px] bg-white">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="text-xl font-black tracking-normal text-[#1f3b49]">ShopNow</div>
          <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="truncate text-sm text-slate-500">Search for products, brands and more</span>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </button>
          <button className="relative grid h-10 w-10 place-items-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e43d4f] px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-5 md:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] md:gap-8 md:py-8">
        <section className="space-y-4">
          <ProductVisual />
          <div className="grid gap-3 sm:grid-cols-3">
            {["40-hour battery", "Adaptive ANC", "Fast USB-C charging"].map((feature) => (
              <div key={feature} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700">
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5 md:pt-2">
          <div>
            <p className="text-sm font-semibold text-[#0f7d5a]">ShopNow Audio</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight tracking-normal text-slate-950 sm:text-3xl">
              {product.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#0f7d5a] px-2 py-1 text-sm font-bold text-white">
                {product.rating}
                <Star className="h-3.5 w-3.5 fill-white" />
              </span>
              <span className="text-sm text-slate-500">{product.reviews.toLocaleString("en-IN")} reviews</span>
              <span className="text-sm font-medium text-[#0f7d5a]">Popular pick</span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex flex-wrap items-end gap-2">
              <span className="text-3xl font-bold text-slate-950">{formatRupees(product.price)}</span>
              <span className="pb-1 text-base text-slate-400 line-through">{formatRupees(product.originalPrice)}</span>
              <span className="pb-1 text-sm font-bold text-[#0f7d5a]">20% off</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Inclusive of all taxes. Free returns for 7 days.</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex gap-3">
              <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#1f76a6]" />
              <div>
                <p className="font-semibold text-slate-900">Delivery by tomorrow</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Free delivery to your saved address. Cash on delivery available.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold text-slate-900">Quantity</p>
            <div className="inline-flex h-11 items-center overflow-hidden rounded-md border border-slate-200">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="grid h-11 w-11 place-items-center text-slate-600 hover:bg-slate-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="grid h-11 w-12 place-items-center border-x border-slate-200 text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => onQuantityChange(Math.min(5, quantity + 1))}
                className="grid h-11 w-11 place-items-center text-slate-600 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAddToCart}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#1f76a6] bg-white px-4 py-3 font-bold text-[#1f76a6] transition hover:bg-[#eef7fb]"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={onBuyNow}
              className="min-h-12 rounded-md bg-[#1f3b49] px-4 py-3 font-bold text-white transition hover:bg-[#172c37]"
            >
              Buy Now
            </button>
          </div>

          <article className="space-y-2 border-t border-slate-200 pt-5">
            <h2 className="text-lg font-bold text-slate-950">Product description</h2>
            <p className="text-sm leading-7 text-slate-600">
              Tuned for daily commutes, work calls and long listening sessions, these wireless headphones combine active noise cancellation,
              plush ear cushions and a lightweight foldable design.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
