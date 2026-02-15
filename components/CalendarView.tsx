"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { useCalendarCompletions } from "@/hooks/useCalendarCompletions";
import { cn } from "@/lib/utils";
import "react-calendar/dist/Calendar.css";

type Props = {
  userId: string | null;
};

export function CalendarView({ userId }: Props) {
  const [month, setMonth] = useState(new Date());
  const completedDates = useCalendarCompletions(userId, month);

  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== "month") return "";
    const key = format(date, "yyyy-MM-dd");
    const isCompleted = completedDates.has(key);
    return cn(
      isCompleted && "react-calendar__tile--completed"
    );
  }

  return (
    <div className="w-full">
      <Calendar
        value={month}
        onChange={(value) => {
          const d = Array.isArray(value) ? value[0] : value;
          if (d instanceof Date) setMonth(d);
        }}
        onActiveStartDateChange={({ activeStartDate }) =>
          activeStartDate && setMonth(activeStartDate)
        }
        tileClassName={tileClassName}
        locale="en-US"
        className="mx-auto rounded-lg border bg-card p-2"
      />
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Green = completed that day
      </p>
    </div>
  );
}
