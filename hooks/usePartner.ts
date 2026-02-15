"use client";

import { useState, useEffect } from "react";
import { getUser } from "@/lib/firestore";
import type { UserDoc } from "@/lib/firestore";

export function usePartner(partnerId: string | null) {
  const [partner, setPartner] = useState<UserDoc | null>(null);

  useEffect(() => {
    if (!partnerId) {
      setPartner(null);
      return;
    }
    let cancelled = false;
    getUser(partnerId).then((doc) => {
      if (!cancelled) setPartner(doc);
    });
    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  return partner;
}
