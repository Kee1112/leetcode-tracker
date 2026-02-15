"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePartner } from "@/hooks/usePartner";
import { useMyCompletionToday } from "@/hooks/useMyCompletionToday";
import { usePartnerCompletionToday } from "@/hooks/usePartnerCompletionToday";
import { usePendingInvites } from "@/hooks/usePendingInvites";
import { MarkDoneButton } from "@/components/MarkDoneButton";
import { PartnerStatus } from "@/components/PartnerStatus";
import { AcceptInviteBanner } from "@/components/AcceptInviteBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user, userDoc, refreshUserDoc } = useAuth();
  const partner = usePartner(userDoc?.partnerId ?? null);
  const completedToday = useMyCompletionToday(user?.uid ?? null);
  const { completed: partnerCompletedToday } = usePartnerCompletionToday(
    userDoc?.partnerId ?? null
  );
  const prevPartnerCompleted = useRef(false);
  const hasToasted = useRef(false);

  useEffect(() => {
    if (partnerCompletedToday && !prevPartnerCompleted.current && partner && !hasToasted.current) {
      hasToasted.current = true;
      toast.success(
        `Your partner completed "${partner.taskName}" today!`,
        { duration: 5000 }
      );
    }
    prevPartnerCompleted.current = partnerCompletedToday;
  }, [partnerCompletedToday, partner]);

  const taskName = userDoc?.taskName ?? "My daily task";
  const { invites } = usePendingInvites(user?.email ?? null);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {invites.length > 0 && (
        <AcceptInviteBanner
          invites={invites}
          acceptorUid={user!.uid}
          onAccepted={refreshUserDoc}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
          <CardDescription>
            Mark your task done when you&apos;ve completed it. Your partner will see it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-medium text-lg">{taskName}</p>
            <MarkDoneButton
              userId={user!.uid}
              completed={completedToday}
              onCompleted={() => {}}
            />
          </div>
          {userDoc?.partnerId && (
            <PartnerStatus
              partnerName={partner?.displayName ?? partner?.email ?? "Partner"}
              partnerTaskName={partner?.taskName ?? ""}
              completedToday={partnerCompletedToday}
            />
          )}
          {!userDoc?.partnerId && (
            <p className="text-sm text-muted-foreground">
              Link a partner in Settings to get notified when they complete their task.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
