import { ChevronLeft, ChevronRight, Circle, RotateCw, ShieldCheck } from "lucide-react";

type BrowserToolbarProps = {
  currentPath: string;
};

export function BrowserToolbar({ currentPath }: BrowserToolbarProps) {
  return (
    <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 sm:px-4">
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="h-3 w-3 rounded-full bg-[#ff6b5f]" />
          <span className="h-3 w-3 rounded-full bg-[#f6c85f]" />
          <span className="h-3 w-3 rounded-full bg-[#54c36f]" />
        </div>
        <button className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white" aria-label="Back">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white" aria-label="Forward">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-white" aria-label="Reload">
          <RotateCw className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[#22a06b]" />
          <span className="truncate">{currentPath}</span>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5" aria-label="Browser extension area">
          <Circle className="hidden h-4 w-4 fill-slate-300 text-slate-300 sm:block" />
          <div className="grid h-6 min-w-6 place-items-center rounded bg-[#e43d4f] px-1 text-[11px] font-bold text-white" title="CashKaro extension">
            CK
          </div>
        </div>
      </div>
    </div>
  );
}
