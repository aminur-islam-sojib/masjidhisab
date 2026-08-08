"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction } from "@/features/Auth/actions";
import { LoginInput, loginSchema } from "@/features/Auth/schema";
import { EyeIcon, GoogleIcon } from "@/components/Auth/auth-icons";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const res = await loginAction(data);

    if (res?.error) {
      setServerError(res.error);
      return;
    }

    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-sm"
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
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Log in to your mosque&rsquo;s workspace.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-gold-400/40 bg-gold-100 px-4 py-3 text-sm text-ink"
        >
          {serverError}
        </div>
      )}

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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
            <p id="email-error" role="alert" className="text-xs text-gold-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-sage-600 underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="h-12 rounded-xl border-sage-200 pr-11 placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-ink-faint transition-colors hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-xl bg-sage-400 text-white shadow-md transition-all duration-200 hover:bg-sage-500 hover:shadow-lg active:scale-[0.98] active:bg-sage-600"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-sage-600 underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
