"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { RegisterInput, registerSchema } from "@/features/Auth/schema";

import { registerAction } from "@/features/Auth/actions";
import { UserRole } from "@/types/auth";
import RegisterPage from "@/components/Auth/register";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
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

  return <RegisterPage />;
}
