"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Phone,
  UserCheck,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createMosqueAction } from "@/features/Mosque/actions";
import {
  createMosqueSchema,
  CreateMosqueInput,
} from "@/features/Mosque/schema";

export function CreateMosqueForm() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateMosqueInput>({
    resolver: zodResolver(createMosqueSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const isStep1Valid = await trigger(["name", "city", "district", "area"]);
    if (isStep1Valid) setStep(2);
  };

  const onSubmit = async (data: CreateMosqueInput) => {
    setServerError(null);
    const res = await createMosqueAction(data);

    if (res?.error) {
      setServerError(res.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-xl mx-auto  ">
      {/* Header Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100/70 border border-sage-200 text-sage-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-sage-600" />
          <span>Setup Workspace</span>
        </div>
        <h1 className="font-heading text-3xl font-semibold text-ink tracking-tight">
          Create Mosque Profile
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Set up your mosque management hub in less than 2 minutes.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= 1
                ? "bg-sage-600 text-white shadow-sm"
                : "bg-sage-100 text-ink-faint"
            }`}
          >
            1
          </div>
          <span
            className={`text-sm font-medium ${
              step >= 1 ? "text-ink" : "text-ink-faint"
            }`}
          >
            Basic Identity
          </span>
        </div>

        <div className="flex-1 h-px bg-sage-200 mx-4" />

        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step === 2
                ? "bg-sage-600 text-white shadow-sm"
                : "bg-sage-100 text-ink-faint"
            }`}
          >
            2
          </div>
          <span
            className={`text-sm font-medium ${
              step === 2 ? "text-ink" : "text-ink-faint"
            }`}
          >
            Operations
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-sage-200/80 rounded-2xl p-6 sm:p-8 shadow-(--shadow-card)">
        {serverError && (
          <div className="mb-6 rounded-xl border border-gold-400/50 bg-gold-100 px-4 py-3 text-sm text-ink flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gold-500 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Mosque Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-ink text-sm font-medium"
                  >
                    Mosque Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <Input
                      id="name"
                      placeholder="e.g. Baitul Mukarram National Mosque"
                      className="pl-10 h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* District & City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="district"
                      className="text-ink text-sm font-medium"
                    >
                      District <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                      <Input
                        id="district"
                        placeholder="e.g. Dhaka"
                        className="pl-10 h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                        {...register("district")}
                      />
                    </div>
                    {errors.district && (
                      <p className="text-xs text-destructive">
                        {errors.district.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="city"
                      className="text-ink text-sm font-medium"
                    >
                      City / Thana <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g. Motijheel"
                      className="h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Area */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="area"
                    className="text-ink text-sm font-medium"
                  >
                    Area / Local Address{" "}
                    <span className="text-ink-faint text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="area"
                    placeholder="e.g. Sector 4, Road 12"
                    className="h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                    {...register("area")}
                  />
                </div>

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-12 mt-4 rounded-xl bg-sage-600 text-white font-medium hover:bg-sage-700 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* Imam Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="imamName"
                    className="text-ink text-sm font-medium"
                  >
                    Head Imam Name{" "}
                    <span className="text-ink-faint text-xs">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                    <Input
                      id="imamName"
                      placeholder="e.g. Maulana Ahmad Hussain"
                      className="pl-10 h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                      {...register("imamName")}
                    />
                  </div>
                </div>

                {/* Contact Phone & Capacity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-ink text-sm font-medium"
                    >
                      Official Contact Phone{" "}
                      <span className="text-ink-faint text-xs">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +8801700000000"
                        className="pl-10 h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="capacity"
                      className="text-ink text-sm font-medium"
                    >
                      Musalli Capacity{" "}
                      <span className="text-ink-faint text-xs">(Approx)</span>
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
                      <Input
                        id="capacity"
                        type="number"
                        placeholder="e.g. 1500"
                        className="pl-10 h-12 rounded-xl border-sage-200 text-ink placeholder:text-ink-faint focus-visible:border-sage-400 focus-visible:ring-sage-400/20"
                        {...register("capacity")}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-12 rounded-xl border-sage-200 text-ink-soft hover:bg-sage-50 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 rounded-xl bg-sage-600 text-white font-medium hover:bg-sage-700 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Creating Workspace…"
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
