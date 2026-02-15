"use client";

import { useState, useEffect } from "react";
import { getPendingInvitesForEmail } from "@/lib/firestore";
import type { InviteDoc } from "@/lib/firestore";

export function usePendingInvites(email: string | null) {
  const [invites, setInvites] = useState<InviteDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setInvites([]);
      setLoading(false);
      return;
    }
    getPendingInvitesForEmail(email).then((list) => {
      setInvites(list);
      setLoading(false);
    });
  }, [email]);

  return { invites, loading };
}
