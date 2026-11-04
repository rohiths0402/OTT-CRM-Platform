import { useCallback, useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  FileSignature,
  Megaphone,
  Wallet,
} from "lucide-react";
import Logo from "../components/Logo";
import HeroSlideshow from "../components/HeroSlideshow";
import LiveFeed from "../components/LiveFeed";
import Marquee from "../components/Marquee";
import LoginPanel from "../components/LoginPanel";
import { useAuth } from "../context/AuthContext";
import { coverPhotos } from "../data/mock";
import { brand } from "../config/brand";

const SLIDE_MS = 5500;

const features = [
  {
    icon: CalendarClock,
    title: "Schedule",
    text: "Call time, location and vanity in one place.",
  },
  {
    icon: FileSignature,
    title: "Contracts",
    text: "Read and sign from your phone.",
  },
  {
    icon: Megaphone,
    title: "Brand deals",
    text: "Every endorsement at a glance.",
  },
  {
    icon: Wallet,
    title: "Payments",
    text: "What you received and what is coming.",
  },
];

const headlineLines = [
  { text: "Your career.", className: "text-ivory", shimmer: false },
  {
    text: "One private room.",
    className:
      "bg-gradient-to-r from-gold-300 via-[#fff3cf] to-gold-500 bg-[length:200%_auto] bg-clip-text text-transparent",
    shimmer: true,
  },
];

const photoMask = "linear-gradient(to right, transparent, black 38%)";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [active, setActive] = useState(0);

  const spotX = useMotionValue(-600);
  const spotY = useMotionValue(-600);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, rgba(217,162,43,0.16), transparent 65%)`;

  useEffect(() => {
    if (params.get("signin") === "1") {
      setPanelOpen(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setTimeout(
      () => setActive((current) => (current + 1) % coverPhotos.length),
      SLIDE_MS,
    );
    return () => clearTimeout(id);
  }, [active, reduceMotion]);

  const openPanel = useCallback(() => setPanelOpen(true), []);
  const closePanel = useCallback(() => setPanelOpen(false), []);

  const handleMove = (event) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    spotX.set(event.clientX - rect.left);
    spotY.set(event.clientY - rect.top);
  };

  const pad = (value) => String(value).padStart(2, "0");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen overflow-hidden bg-ink-950">
        <section
          onMouseMove={handleMove}
          className="relative h-[100svh] min-h-[700px] overflow-hidden"
        >
          <div
            className="absolute inset-y-0 right-0 w-full lg:w-[70%]"
            style={{ maskImage: photoMask, WebkitMaskImage: photoMask }}
          >
            <HeroSlideshow active={active} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/40 lg:bg-none" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: spotlight }}
          />

          <header className="absolute inset-x-0 top-0 z-30">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <Logo />
              <button
                type="button"
                onClick={openPanel}
                className="gold-btn rounded-xl px-6 py-2.5 text-sm font-semibold"
              >
                Sign in
              </button>
            </div>
          </header>

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pb-44 pt-24">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold text-gold-300 backdrop-blur"
            >
              {/* <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400" />
              Private workspace for talent */}
            </motion.p>

            <h1 className="mt-6 max-w-2xl font-display text-5xl font-light leading-[1.02] sm:text-7xl xl:text-8xl">
              {headlineLines.map((line, index) => (
                <span key={line.text} className="block overflow-hidden pb-2">
                  <motion.span
                    initial={{ y: "105%" }}
                    animate={
                      line.shimmer && !reduceMotion
                        ? { y: 0, backgroundPosition: ["0% 50%", "200% 50%"] }
                        : { y: 0 }
                    }
                    transition={{
                      y: {
                        duration: 0.85,
                        delay: 0.2 + index * 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      backgroundPosition: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className={`block ${line.className}`}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 max-w-md text-base leading-relaxed text-ivory/70"
            >
              Shoots, contracts, brand deals and payments. One simple place that
              only you and your team can open.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={openPanel}
                className="gold-btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-7 py-3.5 text-sm font-semibold"
              >
                {!reduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/3 w-1/4 skew-x-[-20deg] bg-white/40 blur-sm"
                    animate={{ x: ["0%", "600%"] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 2.8,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative">Sign in to your workspace</span>
                <ArrowRight className="relative h-4 w-4" />
              </button>
              <span className="text-xs text-ivory/60">
                Invite only. Ask your manager for access.
              </span>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="relative mx-auto h-full max-w-7xl px-6">
              <div className="pointer-events-auto absolute bottom-[4.5rem] left-6 flex items-center gap-5">
                <p className="font-display text-lg">
                  <span className="text-gold-300">{pad(active + 1)}</span>
                  <span className="text-mute">
                    {" "}
                    / {pad(coverPhotos.length)}
                  </span>
                </p>
                <div className="flex gap-2">
                  {coverPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      aria-label={`Show photo ${index + 1}`}
                      onClick={() => setActive(index)}
                      className="group py-2"
                    >
                      <span className="relative block h-[3px] w-7 overflow-hidden rounded-full bg-white/20 transition group-hover:bg-white/40 sm:w-12">
                        {index < active && (
                          <span className="absolute inset-0 bg-gold-400" />
                        )}
                        {index === active && (
                          <motion.span
                            key={active}
                            className="absolute inset-y-0 left-0 bg-gold-300"
                            initial={{ width: reduceMotion ? "100%" : "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: reduceMotion ? 0 : SLIDE_MS / 1000,
                              ease: "linear",
                            }}
                          />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <LiveFeed className="pointer-events-auto absolute bottom-[4.5rem] right-6 hidden w-80 sm:block" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20">
            <Marquee />
          </div>
        </section>

        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.09,
                  ease: "easeOut",
                }}
                className="group border-t border-line pt-6 transition duration-300 hover:border-gold-400"
              >
                <Icon className="h-6 w-6 text-gold-400 transition-transform duration-300 group-hover:-translate-y-1" />
                <h3 className="mt-5 font-display text-2xl text-ivory">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{text}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <footer className="relative border-t border-line/60 px-6 py-6 text-center text-xs text-mute">
          {new Date().getFullYear()} {brand.name}. Private and invite only.
        </footer>

        <AnimatePresence>
          {panelOpen && <LoginPanel key="login" onClose={closePanel} />}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
