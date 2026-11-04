import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogOut, Sparkles, X } from "lucide-react";
import { navItems } from "../data/navigation";

export default function Sidebar({
  name,
  activeTab,
  onSelect,
  open,
  onClose,
  onSignOut,
}) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col overflow-hidden border-r border-white/[0.07] bg-[#100d16] px-4 py-4 shadow-[24px_0_70px_-38px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-2 pb-5">
            <div className="min-w-0">
              <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-300/80">
                <Sparkles className="h-3 w-3" />
                Talent workspace
              </span>
              <h2 className="mt-2 truncate font-display text-xl font-light tracking-wide text-ivory">
                {name}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="rounded-xl border border-white/10 p-2 text-mute transition hover:border-gold-400/30 hover:bg-gold-400/10 hover:text-ivory lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            aria-label="Main"
            className="scrollbar-none mt-5 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pb-4"
          >
            <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-mute/60">
              Studio menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-[13px] font-medium transition duration-200 ${
                    isActive
                      ? "text-gold-200"
                      : "text-mute hover:bg-white/[0.045] hover:text-ivory"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-xl border border-gold-400/25 bg-gradient-to-r from-gold-400/[0.14] to-gold-400/[0.04]"
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold-300"
                    />
                  )}
                  <span className="relative flex min-w-0 items-center gap-3">
                    <Icon className={`h-[17px] w-[17px] shrink-0 transition ${isActive ? "text-gold-300" : "group-hover:text-gold-300"}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="relative grid h-5 min-w-5 place-items-center rounded-full border border-gold-400/20 bg-gold-400/10 px-1.5 text-[10px] font-semibold text-gold-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-3 shrink-0 border-t border-white/[0.08] pt-3">
          <p className="mb-3 flex items-center gap-2 px-2 text-[11px] text-mute">
            <Lock className="h-3.5 w-3.5 text-gold-400" />
            Private session
          </p>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-left text-[13px] font-medium text-mute transition duration-200 hover:border-rose-400/25 hover:bg-rose-400/[0.08] hover:text-rose-300"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04]">
              <LogOut className="h-4 w-4" />
            </span>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
