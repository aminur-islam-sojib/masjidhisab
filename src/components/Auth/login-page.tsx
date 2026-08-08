import { BrandPanel, BrandPanelMobile } from "./BrandPanel";
import { LoginForm } from "./login-form";

 

export const metadata = {
  title: "Log in — MasjidHisab",
  description: "Log in to your mosque's workspace.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <BrandPanelMobile />

      <div className="lg:w-[42%] lg:min-h-screen">
        <BrandPanel />
      </div>

      <div className="flex flex-1 items-center justify-center bg-sage-50/40 px-6 py-12 lg:bg-white lg:px-16">
        <LoginForm />
      </div>
    </div>
  );
}