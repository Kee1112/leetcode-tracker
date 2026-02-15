"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { subscribeCompletionsInRange } from "@/lib/firestore";

export function useCalendarCompletions(userId: string | null, month: Date) {
  const [dates, setDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId) {
      setDates(new Set());
      return;
    }
    const start = format(startOfMonth(month), "yyyy-MM-dd");
    const end = format(endOfMonth(month), "yyyy-MM-dd");
    const unsub = subscribeCompletionsInRange(userId, start, end, setDates);
    return () => unsub();
  }, [userId, month.getTime()]);

  return dates;
}
