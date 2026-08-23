import { Headphones } from "lucide-react";

export function ProductVisual() {
  return (
    <div className="relative flex aspect-[4/3] min-h-[240px] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-[#eef3f6]">
      <div className="absolute inset-x-10 top-10 h-16 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute bottom-8 h-20 w-3/4 rounded-[50%] bg-slate-300/40 blur-xl" />
      <div className="relative grid h-52 w-52 place-items-center rounded-full border border-slate-200 bg-white shadow-lift">
        <div className="absolute h-36 w-36 rounded-full border-[14px] border-[#203541]" />
        <div className="absolute left-8 top-24 h-24 w-12 rounded-2xl bg-[#203541] shadow-lift" />
        <div className="absolute right-8 top-24 h-24 w-12 rounded-2xl bg-[#203541] shadow-lift" />
        <div className="absolute left-12 top-28 h-16 w-5 rounded-full bg-[#dce6eb]" />
        <div className="absolute right-12 top-28 h-16 w-5 rounded-full bg-[#dce6eb]" />
        <Headphones className="relative z-10 h-16 w-16 text-[#22a06b]" strokeWidth={1.7} />
      </div>
    </div>
  );
}
