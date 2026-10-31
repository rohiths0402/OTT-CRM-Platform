import { AnimatePresence, motion } from "framer-motion";
import { Lock, LogOut, X } from "lucide-react";
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-line bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950 px-5 py-6 transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-2 pb-5">
            <div className="min-w-0">
              {/* <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-400">
                Talent Workspace
              </span> */}
              <h2 className="mt-1 truncate font-display text-2xl font-light tracking-wider bg-gradient-to-r from-ivory via-gold-200 to-gold-400 bg-clip-text text-transparent">
                {name}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="rounded-lg p-1.5 text-mute transition hover:bg-white/5 hover:text-ivory lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Main" className="mt-6 space-y-1">
            <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-mute/70">
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
                  className={`group relative flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-gold-300"
                      : "text-mute hover:bg-white/[0.04] hover:text-ivory"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                      className="absolute inset-0 rounded-xl border border-gold-400/30 bg-gold-400/15"
                    />
                  )}
                  <span className="relative flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="relative grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1.5 text-[11px] font-bold text-ink-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-line pt-4">
          <p className="flex items-center gap-2 px-3 text-xs text-mute">
            <Lock className="h-3.5 w-3.5 text-gold-400" />
            Private session
          </p>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm text-mute transition duration-200 hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
