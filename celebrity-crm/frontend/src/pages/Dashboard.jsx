import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/TopBar";
import DashboardHome from "../components/DashboardHome";
import ScheduleView from "../components/schedule/ScheduleView";
import ProjectsView from "../components/projects/ProjectsView";
import PaymentsView from "../components/payments/PaymentsView";
import BrandDealsView from "../components/BrandDealsView";
import ContractsView from "../components/ContractsView";
import ProfileView from "../components/ProfileView";
import SecurityView from "../components/SecurityView";
import { useAuth } from "../context/AuthContext";
import { navItems } from "../data/navigation";
import { initialDeals } from "../data/brandDeals";
import { initialContracts } from "../data/contracts";
import { payments as initialPayments } from "../data/payments";

export default function Dashboard() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [context, setContext] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deals, setDeals] = useState(initialDeals);
  const [contracts, setContracts] = useState(initialContracts);
  const [paymentItems, setPaymentItems] = useState(initialPayments);
  const [outgoingPayments, setOutgoingPayments] = useState([]);

  const name = user?.name || "Guest";
  const current =
    navItems.find((entry) => entry.id === activeTab) || navItems[0];

  const select = (id, payload) => {
    setContext(payload || null);
    setActiveTab(id);
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
      return <ScheduleView initialDate={context?.date} />;
    if (activeTab === "projects")
      return (
        <ProjectsView
          onNavigate={select}
          initialProjectId={context?.projectId}
        />
      );
    if (activeTab === "payments")
      return (
        <PaymentsView
          initialPaymentId={context?.paymentId}
          paymentItems={paymentItems}
          outgoingPayments={outgoingPayments}
          onRecordOutgoing={(payment) =>
            setOutgoingPayments((currentPayments) => [
              payment,
              ...currentPayments,
            ])
          }
          onSettle={(paymentId, settlement) =>
            setPaymentItems((currentPayments) =>
              currentPayments.map((payment) =>
                payment.id === paymentId
                  ? {
                      ...payment,
                      status: settlement.isComplete ? "received" : payment.status,
                      date: settlement.isComplete
                        ? settlement.date
                        : payment.date,
                      reference: settlement.reference,
                      method: settlement.method,
                      receivedAmount:
                        (payment.receivedAmount || 0) + settlement.amount,
                      lastPaidDate: settlement.date,
                    }
                  : payment,
              ),
            )
          }
        />
      );
    if (activeTab === "deals")
      return (
        <BrandDealsView
          deals={deals}
          onAddDeal={(deal) => setDeals((currentDeals) => [deal, ...currentDeals])}
          onNavigate={select}
        />
      );
    if (activeTab === "contracts")
      return (
        <ContractsView
          contracts={contracts}
          onAddContract={(contract) =>
            setContracts((currentContracts) => [contract, ...currentContracts])
          }
          onSignContract={(contractId, signer, signatureData) =>
            setContracts((currentContracts) =>
              currentContracts.map((contract) =>
                contract.id === contractId
                  ? {
                      ...contract,
                      status: "Signed",
                      signedBy: signer,
                      signatureData,
                      signedAt: new Date().toLocaleDateString("en-IN"),
                      updated: "Signed just now",
                      action: "Signed in this demo workspace.",
                    }
                  : contract,
              ),
            )
          }
        />
      );
    if (activeTab === "security")
      return <SecurityView email={user?.email} onSignOut={handleSignOut} />;
    if (activeTab === "profile")
      return <ProfileView user={user} onSave={updateUser} />;
    return null;
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-ink-950">
        <Sidebar
          name={name}
          photo={user?.profilePhoto}
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
            photo={user?.profilePhoto}
            onOpenMenu={() => setMenuOpen(true)}
            onOpenProfile={() => select("profile")}
            onNavigate={select}
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
