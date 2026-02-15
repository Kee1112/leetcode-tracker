"use client";

import { useAuth } from "@/contexts/AuthContext";
import { TaskNameForm } from "@/components/TaskNameForm";
import { LinkPartnerForm } from "@/components/LinkPartnerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const { user, userDoc, refreshUserDoc } = useAuth();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your task</CardTitle>
          <CardDescription>
            The one daily task you want to stay accountable for (e.g. Leetcode, Exercise, Read).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskNameForm
            uid={user!.uid}
            currentTaskName={userDoc?.taskName ?? "My daily task"}
            onSaved={refreshUserDoc}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Partner</CardTitle>
          <CardDescription>
            Link with a friend by email. You&apos;ll see when they complete their task and they&apos;ll see when you do.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkPartnerForm
            myUid={user!.uid}
            currentPartnerId={userDoc?.partnerId ?? null}
            onLinked={refreshUserDoc}
          />
        </CardContent>
      </Card>
    </div>
  );
}
