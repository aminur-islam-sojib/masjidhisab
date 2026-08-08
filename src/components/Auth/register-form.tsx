"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "./password-strength";

import { RegisterInput, registerSchema } from "@/features/Auth/schema";
import { registerAction } from "@/features/Auth/actions";
import { UserRole } from "@/types/auth";
import { EyeIcon } from "lucide-react";
import { GoogleIcon } from "./brand-panel";

function CheckmarkAnimation() {
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="28"
        cy="28"
        r="26"
        stroke="var(--color-sage-400)"
        strokeWidth="2.5"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
          },
        }}
      />
      <motion.path
        d="M17 29l7 7 15-15"
        stroke="var(--color-sage-500)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: { duration: 0.35, delay: 0.35, ease: "easeOut" },
          },
        }}
      />
    </motion.svg>
  );
}

type ViewState = "form" | "success";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ViewState>("form");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: UserRole.MEMBER },
  });

  const password = watch("password") || "";

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const res = await registerAction(data);

    if (res?.error) {
      setServerError(res.error);
      return;
    }

    // Brief success state before handing off to /login, matching the
    // original redirect behavior.
    setView("success");
    setTimeout(() => {
      router.push("/login");
    }, 750);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <AnimatePresence mode="wait">
        {view === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <CheckmarkAnimation />
            <p className="mt-4 font-heading text-lg text-ink">
              Account created
            </p>
            <p className="mt-1 text-sm text-ink-soft">Taking you to log in…</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Wordmark */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-400">
                <span className="font-heading text-sm font-semibold text-white">
                  M
                </span>
              </div>
              <span className="font-heading text-base font-semibold text-ink">
                MasjidHisab
              </span>
            </div>

            <h1 className="font-heading text-3xl font-semibold tracking-tight text-ink">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Set up your mosque&rsquo;s workspace in a few minutes.
            </p>

            {serverError && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-gold-400/40 bg-gold-100 px-4 py-3 text-sm text-ink"
              >
                {serverError}
              </div>
            )}

            {/* shadcn Button, variant="outline", restyled to the sage palette via className */}
            <Button
              type="button"
              variant="outline"
              className="mt-7 h-12 w-full rounded-xl border-sage-200 bg-white text-ink shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white hover:shadow-md active:scale-[0.98]"
              onClick={() => {
                /* trigger OAuth flow */
              }}
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-sage-200" />
              <span className="text-xs text-ink-faint">or</span>
              <span className="h-px flex-1 bg-sage-200" />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Imam Abdullah Rahman"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-12 rounded-xl border-sage-200 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                  {...register("name")}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-xs text-gold-500"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@yourmosque.org"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl border-sage-200 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                  {...register("email")}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-xs text-gold-500"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-12 rounded-xl border-sage-200 pr-11 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-ink-faint transition-colors hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                <PasswordStrength password={password} />
                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-xs text-gold-500"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* shadcn Button, variant="default", restyled to sage-400 */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-sage-400 text-white shadow-md transition-all duration-200 hover:bg-sage-500 hover:shadow-lg active:scale-[0.98] active:bg-sage-600"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-sage-600 underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
              By creating an account you agree to MasjidHisab&rsquo;s{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-ink-soft"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-ink-soft"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
