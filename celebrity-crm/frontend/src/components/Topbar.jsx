import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, Menu, MoveUpRight } from "lucide-react";
import Avatar from "./Avatar";
import { notifications as initialNotifications } from "../data/mock";

export default function Topbar({
  title,
  name,
  photo,
  onOpenMenu,
  onOpenProfile,
  onNavigate,
}) {
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
    setItems((previous) => previous.map((item) => ({ ...item, read: true })));

  const openNotification = (item) => {
    setItems((previous) =>
      previous.map((entry) =>
        entry.id === item.id ? { ...entry, read: true } : entry,
      ),
    );
    setOpen(false);
    onNavigate(item.target, item.payload);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.06] bg-gradient-to-r from-ink-950/95 via-ink-950/90 to-ink-900/80 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-ivory transition hover:bg-white/5 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {/* <span className="hidden h-9 w-px bg-gradient-to-b from-transparent via-gold-400/50 to-transparent lg:block" /> */}
        {/* <div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-gold-300/80">
            Private talent suite
          </p>
          <h1 className="font-display text-xl leading-tight text-ivory sm:text-2xl">
            {title}
          </h1>
        </div> */}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="relative"
          ref={wrapperRef}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <motion.button
            type="button"
            aria-label="Notifications"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`relative grid h-11 w-11 place-items-center rounded-2xl border transition duration-200 ${
              open
                ? "border-gold-400/30 bg-gold-400/10 text-gold-300"
                : "border-white/[0.06] bg-white/[0.03] text-mute hover:border-gold-400/25 hover:text-gold-300"
            }`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
              </span>
            )}
          </motion.button>

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
                      className={`overflow-hidden rounded-xl border transition ${
                        item.read
                          ? "border-transparent text-mute"
                          : "border-gold-400/10 bg-white/[0.04] text-ivory"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openNotification(item)}
                        className="group w-full p-3 text-left transition hover:bg-gold-400/[0.06]"
                      >
                        <span className="flex items-center justify-between gap-3 text-sm font-medium">
                          <span>{item.title}</span>
                          <span className="shrink-0 text-xs font-normal text-mute">
                            {item.time}
                          </span>
                        </span>
                        <span className="mt-1 flex items-end justify-between gap-3">
                          <span className="text-xs leading-relaxed text-mute">
                            {item.desc}
                          </span>
                          <MoveUpRight className="h-3.5 w-3.5 shrink-0 text-gold-300 opacity-0 transition group-hover:opacity-100" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          aria-label={`Open ${name}'s profile`}
          className="group flex min-w-0 items-center gap-3 rounded-2xl p-1.5 text-left transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
        >
          <span className="rounded-full bg-gradient-to-br from-gold-300/70 to-aqua-400/70 p-[2px]">
            <Avatar
              name={name}
              photo={photo}
              className="h-10 w-10 border-2 border-ink-900 sm:h-11 sm:w-11"
            />
          </span>
          {/* <span className="hidden min-w-0 sm:block">
            <span className="block truncate font-display text-sm text-ivory transition group-hover:text-gold-300">
              {name}
            </span> */}
            {/* <span className="mt-0.5 block text-[10px] uppercase tracking-[0.16em] text-mute">
              Talent workspace
            </span> */}
          {/* </span> */}
        </button>
      </div>
    </header>
  );
}
