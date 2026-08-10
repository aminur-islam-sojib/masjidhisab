// app/(public)/masjid/[slug]/login-step.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginStep({ mosqueSlug }: { mosqueSlug: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) setError("Invalid email or password");
    // On success, useSession() in the parent picks up the new state automatically.
  }

  return (
    <div className="space-y-4 pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google")}
        className="w-full border-sage-200 rounded-xl"
      >
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-sage-200" />
        <span className="text-ink-faint text-xs">or</span>
        <div className="h-px flex-1 bg-sage-200" />
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-ink-soft text-sm">
            Email
          </Label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="login-password" className="text-ink-soft text-sm">
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-sage-200 focus-visible:ring-sage-400 rounded-xl"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-sage-400 hover:bg-sage-500 rounded-xl"
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <p className="text-center text-ink-soft text-sm pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href={`/register?callbackUrl=/masjid/${mosqueSlug}`}
          className="text-sage-600 font-medium hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
