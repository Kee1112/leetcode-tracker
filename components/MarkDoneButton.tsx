"use client";

import { useState } from "react";
import { format } from "date-fns";
import { setCompletion } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type Props = {
  userId: string;
  completed: boolean;
  onCompleted: () => void;
  disabled?: boolean;
};

export function MarkDoneButton({
  userId,
  completed,
  onCompleted,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleMarkDone() {
    if (completed) return;
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      await setCompletion(userId, today);
      onCompleted();
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <div className="flex items-center gap-2 text-primary font-medium">
        <Check className="h-5 w-5" />
        <span>Done for today</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleMarkDone}
      disabled={disabled || loading}
    >
      {loading ? "Saving..." : "Mark done today"}
    </Button>
  );
}
