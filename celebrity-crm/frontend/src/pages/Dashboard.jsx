import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardHome from "../components/DashboardHome";
import ScheduleView from "../components/schedule/ScheduleView";
import ProjectsView from "../components/projects/ProjectsView";
import PaymentsView from "../components/PaymentsView";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useAuth } from "../context/AuthContext";
import { navItems } from "../data/navigation";

function ComingSoon({ item }) {
  const Icon = item.icon;
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-line bg-ink-900/60 px-6 py-24 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold-400/30 bg-gold-400/10">
        <Icon className="h-6 w-6 text-gold-400" />
      </span>
      <h2 className="mt-5 font-display text-2xl text-ivory">{item.label}</h2>
      <p className="mt-2 max-w-sm text-sm text-mute">
        This section is being set up and will be available soon.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  const name = user?.name || "Guest";
  const current =
    navItems.find((entry) => entry.id === activeTab) || navItems[0];

  const select = (id, date) => {
    setActiveTab(id);
    if (date) setSelectedDate(date);
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    if (activeTab === "home")
      return <DashboardHome name={name} onNavigate={select} />;
    if (activeTab === "schedule")
      return <ScheduleView initialSelectedDate={selectedDate} />;
    if (activeTab === "projects") return <ProjectsView onNavigate={select} />;
    if (activeTab === "payments") return <PaymentsView />;
    if (activeTab === "security") {
      return (
        <div>
          <h2 className="font-display text-4xl font-light text-ivory">
            Security
          </h2>
          <p className="mt-2 text-sm text-mute">
            Change the password you use to sign in with your email.
          </p>
          <div className="mt-8 rounded-3xl border border-line bg-ink-900 p-6 sm:p-8">
            <ChangePasswordForm />
          </div>
        </div>
      );
    }
    return <ComingSoon item={current} />;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-950">
        <Sidebar
          name={name}
          activeTab={activeTab}
          onSelect={select}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onSignOut={handleSignOut}
        />

        <div className="lg:pl-72">
          <Topbar
            title={current.label}
            name={name}
            onOpenMenu={() => setMenuOpen(true)}
          />
          <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
