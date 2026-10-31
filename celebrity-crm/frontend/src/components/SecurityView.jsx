import { motion } from "framer-motion";
import {
  Fingerprint,
  KeyRound,
  LockKeyhole,
  LogOut,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";

const accessCards = [
  {
    icon: KeyRound,
    title: "Password",
    detail: "Update your sign-in password at any time.",
    tone: "text-gold-300 border-gold-400/20 bg-gold-400/10",
  },
  {
    icon: Smartphone,
    title: "Verification codes",
    detail: "Mobile code sign-in is available for your workspace.",
    tone: "text-aqua-400 border-aqua-400/20 bg-aqua-400/10",
  },
  {
    icon: Fingerprint,
    title: "Private workspace",
    detail: "Your talent workspace is limited to invited members.",
    tone: "text-rose-400 border-rose-400/20 bg-rose-400/10",
  },
];

export default function SecurityView({ email, onSignOut }) {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[2rem] border border-rose-400/20 bg-gradient-to-br from-[#291621] via-ink-900 to-[#111822] p-6 sm:p-9"
      >
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-48 w-48 rounded-full bg-aqua-400/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-rose-300">
              <ShieldCheck className="h-4 w-4" />
              Security center
            </div>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl">
              Your career.
              <br />
              <span className="text-rose-200">Your boundaries.</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-mute">
              Manage how you sign in and keep your private workspace in your
              control.
            </p>
          </div>
          <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-950/50 p-4 backdrop-blur">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-aqua-400/20 bg-aqua-400/10 text-aqua-400">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-mute">
                Current account
              </span>
              <span className="mt-1 block max-w-56 truncate text-sm text-ivory">
                {email || "Signed-in account"}
              </span>
            </span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-3 md:grid-cols-3">
        {accessCards.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.07 }}
              className="rounded-2xl border border-line bg-ink-900 p-4 transition hover:border-white/15 sm:p-5"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl border ${item.tone}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold text-ivory">
                {item.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-mute">{item.detail}</p>
            </motion.article>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="rounded-3xl border border-line bg-ink-900 p-5 sm:p-8"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-300">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-2xl text-ivory">
                Change password
              </h3>
              <p className="mt-1 text-sm text-mute">
                Verify your current password before setting a new one.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-line pt-6">
            <ChangePasswordForm />
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <section className="flex-1 rounded-3xl border border-line bg-ink-900 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-aqua-400/10 text-aqua-400">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-ivory">
                Keep your access safe
              </h3>
            </div>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-400" />
                <span>
                  <span className="block text-ivory">Use a unique password</span>
                  <span className="mt-1 block text-xs leading-5 text-mute">
                    Include an uppercase letter, a number and a symbol.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" />
                <span>
                  <span className="block text-ivory">Protect your codes</span>
                  <span className="mt-1 block text-xs leading-5 text-mute">
                    Never share a sign-in or verification code with anyone.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span>
                  <span className="block text-ivory">Leave shared devices</span>
                  <span className="mt-1 block text-xs leading-5 text-mute">
                    Sign out when you finish on a device you do not own.
                  </span>
                </span>
              </li>
            </ul>
          </section>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center justify-between rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-4 text-left transition hover:border-rose-400/40 hover:bg-rose-400/[0.08]"
          >
            <span>
              <span className="block text-sm font-medium text-rose-300">
                Sign out of this device
              </span>
              <span className="mt-1 block text-xs text-mute">
                End your current private session.
              </span>
            </span>
            <LogOut className="h-4 w-4 text-rose-300" />
          </button>
        </motion.aside>
      </div>
    </div>
  );
}
