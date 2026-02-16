"use client";

import { useState, useEffect } from "react";
import { subscribeAllCompletions } from "@/lib/firestore";

export function useCalendarCompletions(userId: string | null, month: Date) {
  const [dates, setDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      setDates(new Set());
      return;
    }
    // Fetch all completions so they show as green permanently across all months
    const unsub = subscribeAllCompletions(userId, setDates);
    return () => unsub();
  }, [userId]);

  return dates;
}
