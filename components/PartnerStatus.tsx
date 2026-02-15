"use client";

import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

type Props = {
  partnerName: string;
  partnerTaskName: string;
  completedToday: boolean;
};

export function PartnerStatus({
  partnerName,
  partnerTaskName,
  completedToday,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">
        Partner: <span className="font-medium text-foreground">{partnerName || "—"}</span>
        {partnerTaskName && (
          <span className="text-muted-foreground"> ({partnerTaskName})</span>
        )}
      </span>
      {completedToday && (
        <Badge variant="success" className="gap-1">
          <Check className="h-3 w-3" />
          Completed today
        </Badge>
      )}
    </div>
  );
}
