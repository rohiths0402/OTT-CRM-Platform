import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Menu } from "lucide-react";
import Avatar from "./Avatar";
import { notifications as initialNotifications } from "../data/mock";

export default function Topbar({ title, name, onOpenMenu }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const wrapperRef = useRef(null);
  const unread = items.filter((item) => !item.read).length;

  useEffect(() => {
    const handlePointer = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target))
        setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const markAllRead = () =>
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-line/60 bg-ink-950/80 px-5 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-ivory transition hover:bg-white/5 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-ivory">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={wrapperRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="relative grid h-10 w-10 place-items-center rounded-full text-mute transition duration-200 hover:bg-white/5 hover:text-gold-300"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-line bg-ink-900 p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-semibold text-ivory">
                    Notifications
                  </span>
                  {unread > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-gold-400 transition hover:text-gold-300"
                    >
                      <Check className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                </div>
                <ul className="mt-3 space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={`rounded-xl p-3 transition ${item.read ? "text-mute" : "bg-white/[0.04] text-ivory"}`}
                    >
                      <div className="flex items-center justify-between gap-3 text-sm font-medium">
                        <span>{item.title}</span>
                        <span className="shrink-0 text-xs font-normal text-mute">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-mute">
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span title={name}>
          <Avatar name={name} />
        </span>
      </div>
    </header>
  );
}