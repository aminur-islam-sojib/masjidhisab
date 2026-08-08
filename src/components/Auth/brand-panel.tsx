"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength } from "./password-strength";

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58A8.9 8.9 0 0 0 9 0 9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2M6.2 6.5C3.9 8 2.5 12 2.5 12s3.5 7 10 7c1.7 0 3.2-.4 4.4-1.1M17.8 17.6C19.9 16 21.5 12 21.5 12s-1.4-2.8-3.6-4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

type FormState = "idle" | "submitting" | "success";

export function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [state, setState] = React.useState<FormState>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setState("submitting");
    // Simulate account creation, then show a brief success state
    // before the app would redirect to onboarding.
    setTimeout(() => {
      setState("success");
      setTimeout(() => {
        // router.push("/onboarding") in a real app
      }, 750);
    }, 700);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <AnimatePresence mode="wait">
        {state === "success" ? (
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
            <p className="mt-1 text-sm text-ink-soft">
              Taking you to your workspace…
            </p>
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

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Imam Abdullah Rahman"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-12 rounded-xl border-sage-200 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-xs text-gold-400"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@yourmosque.org"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12 rounded-xl border-sage-200 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-xs text-gold-400"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-12 rounded-xl border-sage-200 pr-11 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
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
                    className="text-xs text-gold-400"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              {/* shadcn Button, variant="default", restyled to sage-400 */}
              <Button
                type="submit"
                disabled={state === "submitting"}
                className="h-12 w-full rounded-xl bg-sage-400 text-white shadow-md transition-all duration-200 hover:bg-sage-500 hover:shadow-lg active:scale-[0.98] active:bg-sage-600"
              >
                {state === "submitting"
                  ? "Creating account…"
                  : "Create account"}
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
