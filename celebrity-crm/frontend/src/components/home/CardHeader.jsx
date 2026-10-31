import { ChevronRight } from "lucide-react";

export default function CardHeader({ title, badge, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-ivory">
        {title}
        {badge ? (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1.5 text-[11px] font-bold text-ink-950">
            {badge}
          </span>
        ) : null}
      </h3>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="group flex items-center gap-0.5 text-xs font-semibold text-gold-400 transition hover:text-gold-300"
        >
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}
