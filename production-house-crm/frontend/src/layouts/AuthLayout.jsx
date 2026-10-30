import { Outlet, useLocation } from "react-router-dom";
import BrandPanel from "../components/BrandPanel";
import { LOGIN_PANEL, SIGNUP_PANEL } from "../config/brandContent";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const panel = pathname.startsWith("/signup") ? SIGNUP_PANEL : LOGIN_PANEL;

  return (
    <main className="min-h-screen bg-studio-bg text-white lg:grid lg:grid-cols-[55fr_45fr]">
      <BrandPanel content={panel} />

      <section className="relative bg-studio-bg lg:h-screen lg:overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
