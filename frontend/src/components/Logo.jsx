import { Gem } from "lucide-react";
import { brand } from "../config/brand";

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold-500/40 bg-ink-800">
        <Gem className="h-5 w-5 text-gold-400" strokeWidth={1.6} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-2xl font-semibold tracking-wide gold-text">
            {brand.name}
          </span>
          <span className="mt-1 block text-[11px] text-mute">
            {brand.product}
          </span>
        </span>
      )}
    </div>
  );
}
