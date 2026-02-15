"use client";

import { useState, useEffect } from "react";
import { acceptInvite, getUser } from "@/lib/firestore";
import type { InviteDoc } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  invites: InviteDoc[];
  acceptorUid: string;
  onAccepted: () => void;
};

export function AcceptInviteBanner({ invites, acceptorUid, onAccepted }: Props) {
  const [loading, setLoading] = useState(false);
  const [inviterName, setInviterName] = useState<string>("");

  useEffect(() => {
    if (invites.length === 0) return;
    const inv = invites[0];
    getUser(inv.fromUserId).then((u) => {
      setInviterName(u ? (u.displayName || u.email) : inv.fromUserId);
    });
  }, [invites]);

  if (invites.length === 0) return null;

  const inv = invites[0];

  async function handleAccept() {
    setLoading(true);
    try {
      await acceptInvite(inv, acceptorUid);
      toast.success("Partner linked!");
      onAccepted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border bg-primary/10 border-primary/20 p-4 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm">
        <span className="font-medium">{inviterName || "Someone"}</span> invited you as an accountability partner.
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAccept} disabled={loading}>
          {loading ? "Accepting..." : "Accept"}
        </Button>
      </div>
    </div>
  );
}
