"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
import Link from "next/link";
import { RegisterInput, registerSchema } from "@/features/Auth/schema";

import { registerAction } from "@/features/Auth/actions";
import { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: UserRole.MEMBER },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    const res = await registerAction(data);
    
    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-8 rounded-xl shadow-2xl relative group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Onboard Entity</h1>
      <p className="text-zinc-400 mb-8 text-sm">Register your credentials to the network.</p>

      {error && (
        <div className="bg-red-950/50 border border-red-500/50 text-red-400 p-3 rounded text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Identifier</label>
          <input
            {...register("name")}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email Designation</label>
          <input
            {...register("email")}
            type="email"
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
            placeholder="operative@mosque.net"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Encryption Key</label>
          <input
            {...register("password")}
            type="password"
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 mt-4 rounded border border-zinc-700 hover:border-purple-500 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Compile & Register"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link className="text-sm text-zinc-500 hover:text-purple-400 transition-colors" href="/login">
          Return to Login
        </Link>
      </div>
    </div>
  );
}