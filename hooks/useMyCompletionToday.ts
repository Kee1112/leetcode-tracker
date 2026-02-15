"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { subscribeMyCompletionToday } from "@/lib/firestore";

export function useMyCompletionToday(userId: string | null) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!userId) {
      setCompleted(false);
      return;
    }
    const today = format(new Date(), "yyyy-MM-dd");
    const unsub = subscribeMyCompletionToday(userId, today, setCompleted);
    return () => unsub();
  }, [userId]);

  return completed;
}
