// app/(public)/masjid/[slug]/join-mosque-button.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import LoginStep from "./login-step";
import JoinMosqueForm from "./join-mosque-form";
import LoginStep from "./login-step";

export default function JoinMosqueButton({
  mosqueSlug,
  mosqueName,
}: {
  mosqueSlug: string;
  mosqueName: string;
}) {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);

  const alreadyInMosque = !!session?.user?.mosqueId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={alreadyInMosque}
          className="bg-sage-400 hover:bg-sage-500 text-white rounded-xl shadow-lg px-6 disabled:opacity-60"
        >
          {alreadyInMosque ? "Already part of a mosque" : "Join this mosque"}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-ink">
            {status === "authenticated"
              ? `Join ${mosqueName}`
              : `Log in to join ${mosqueName}`}
          </DialogTitle>
        </DialogHeader>

        {status === "loading" ? (
          <div className="py-10 text-center text-ink-faint text-sm">
            Loading...
          </div>
        ) : status === "authenticated" ? (
          <JoinMosqueForm
            mosqueSlug={mosqueSlug}
            onSuccess={() => setOpen(false)}
          />
        ) : (
          <LoginStep mosqueSlug={mosqueSlug} />
        )}
      </DialogContent>
    </Dialog>
  );
}
