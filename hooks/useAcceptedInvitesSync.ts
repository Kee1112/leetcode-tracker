"use client";

import { useEffect, useRef } from "react";
import {
  subscribeAcceptedInvitesFromMe,
  updateUserPartnerId,
} from "@/lib/firestore";

/**
 * When the current user has sent invites that get accepted, update our user doc
 * with partnerId so we're linked. (Acceptor can't write our doc; we do it here.)
 */
export function useAcceptedInvitesSync(
  myUid: string | null,
  hasPartnerAlready: boolean,
  onUpdated: () => void
) {
  const processed = useRef(new Set<string>());

  useEffect(() => {
    if (!myUid || hasPartnerAlready) return;
    const unsub = subscribeAcceptedInvitesFromMe(myUid, async (partnerUid) => {
      if (processed.current.has(partnerUid)) return;
      processed.current.add(partnerUid);
      await updateUserPartnerId(myUid, partnerUid);
      onUpdated();
    });
    return () => unsub();
  }, [myUid, hasPartnerAlready, onUpdated]);
}
