"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { subscribePartnerCompletionToday } from "@/lib/firestore";

export function usePartnerCompletionToday(partnerId: string | null) {
  const [completed, setCompleted] = useState(false);
  const prevCompleted = useRef(false);

  useEffect(() => {
    if (!partnerId) {
      setCompleted(false);
      return;
    }
    const today = format(new Date(), "yyyy-MM-dd");
    const unsub = subscribePartnerCompletionToday(partnerId, today, (val) => {
      setCompleted(val);
    });
    return () => unsub();
  }, [partnerId]);

  return { completed, prevCompleted };
}
