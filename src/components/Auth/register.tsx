import { BrandPanel, BrandPanelMobile } from "./BrandPanel";
import { RegisterForm } from "./register-form";

export const metadata = {
  title: "Create your account — MasjidHisab",
  description: "Set up your mosque's workspace in a few minutes.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <BrandPanelMobile />

      {/* Left: brand panel (desktop only) */}
      <div className="lg:w-[42%] lg:min-h-screen">
        <BrandPanel />
      </div>

      {/* Right: form */}
      <div className="flex flex-1 items-center justify-center bg-sage-50/40 px-6 py-12 lg:bg-white lg:px-16">
        <RegisterForm />
      </div>
    </div>
  );
}
