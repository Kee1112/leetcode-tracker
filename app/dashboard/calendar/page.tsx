"use client";

import { useAuth } from "@/contexts/AuthContext";
import { CalendarView } from "@/components/CalendarView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            Your completion history. Green = you completed your task that day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView userId={user?.uid ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
