"use client";

import { useState } from "react";
import { linkPartnerByEmail } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  myUid: string;
  currentPartnerId: string | null;
  onLinked: () => void;
};

export function LinkPartnerForm({
  myUid,
  currentPartnerId,
  onLinked,
}: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await linkPartnerByEmail(myUid, email);
      if (result === "linked") {
        toast.success("Partner linked.");
        onLinked();
        setEmail("");
      } else {
        toast.success("Invite sent. They can accept when they sign in.");
        setEmail("");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (currentPartnerId) {
    return (
      <p className="text-sm text-muted-foreground">
        You already have a partner linked. To change, contact support or create a new account.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="partnerEmail">Partner&apos;s email</Label>
        <Input
          id="partnerEmail"
          type="email"
          placeholder="partner@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Link partner"}
      </Button>
      <p className="text-xs text-muted-foreground">
        If they have an account, you&apos;ll be linked immediately. Otherwise they&apos;ll get an invite when they sign up with that email.
      </p>
    </form>
  );
}
