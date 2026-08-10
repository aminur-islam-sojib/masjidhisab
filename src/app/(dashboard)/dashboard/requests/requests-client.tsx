// app/(dashboard)/dashboard/[mosqueId]/requests/requests-client.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveJoinRequest, rejectJoinRequest } from "@/features/family/actions";
import { Check, X, Users } from "lucide-react";

interface JoinRequest {
  _id: string;
  headOfFamilyName: string;
  phone: string;
  address: string;
  memberCount: number;
  userId: { name: string; email: string } | null;
}

export default function RequestsClient({ requests: initialRequests }: { requests: JoinRequest[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  function handleDecision(id: string, action: typeof approveJoinRequest) {
    setProcessingId(id);
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        setRequests((prev) => prev.filter((r) => r._id !== id));
      }
      setProcessingId(null);
    });
  }

  if (requests.length === 0) {
    return <div className="text-center py-16 text-ink-faint">No pending requests right now.</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <div
          key={req._id}
          className="bg-white rounded-2xl border border-sage-200 p-5 flex items-center justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-ink font-medium">{req.headOfFamilyName}</p>
            <p className="text-ink-soft text-sm">
              {req.phone} · {req.address}
            </p>
            <div className="flex items-center gap-1.5 text-ink-faint text-xs mt-1">
              <Users className="h-3.5 w-3.5" />
              {req.memberCount} family members
              {req.userId?.email && <span className="ml-2">· {req.userId.email}</span>}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={isPending && processingId === req._id}
              onClick={() => handleDecision(req._id, approveJoinRequest)}
              className="bg-sage-400 hover:bg-sage-500 rounded-xl"
            >
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending && processingId === req._id}
              onClick={() => handleDecision(req._id, rejectJoinRequest)}
              className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}