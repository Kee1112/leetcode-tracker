import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
  writeBatch,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { getDb } from "./firebase";

export type UserDoc = {
  uid: string;
  email: string;
  displayName?: string | null;
  partnerId?: string | null;
  taskName: string;
  createdAt: Timestamp;
};

export type CompletionDoc = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completedAt: Timestamp;
};

export type InviteDoc = {
  id: string;
  fromUserId: string;
  toUserEmail: string;
  status: "pending" | "accepted" | "rejected";
  acceptorUid?: string; // set when accepted (so inviter can update their partnerId)
  createdAt: Timestamp;
};

const USERS = "users";
const COMPLETIONS = "completions";
const INVITES = "invites";

export function userRef(uid: string) {
  return doc(getDb(), USERS, uid);
}

export function completionRef(id: string) {
  return doc(getDb(), COMPLETIONS, id);
}

export function completionId(userId: string, date: string) {
  return `${userId}_${date}`;
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function setUser(
  uid: string,
  data: Omit<UserDoc, "uid" | "createdAt"> & { createdAt?: Timestamp }
) {
  const ref = userRef(uid);
  await setDoc(ref, {
    ...data,
    uid,
    createdAt: data.createdAt ?? serverTimestamp(),
  } as UserDoc);
}

export async function updateUserTaskName(uid: string, taskName: string) {
  await setDoc(
    userRef(uid),
    { taskName },
    { merge: true }
  );
}

export async function updateUserPartnerId(uid: string, partnerId: string) {
  await setDoc(userRef(uid), { partnerId }, { merge: true });
}

export async function setCompletion(userId: string, date: string) {
  const id = completionId(userId, date);
  await setDoc(completionRef(id), {
    id,
    userId,
    date,
    completedAt: serverTimestamp(),
  });
}

export async function getCompletion(userId: string, date: string): Promise<CompletionDoc | null> {
  const snap = await getDoc(completionRef(completionId(userId, date)));
  return snap.exists() ? (snap.data() as CompletionDoc) : null;
}

export function subscribeCompletionsInRange(
  userId: string,
  startDate: string,
  endDate: string,
  onData: (dates: Set<string>) => void
): Unsubscribe {
  const q = query(
    collection(getDb(), COMPLETIONS),
    where("userId", "==", userId),
    where("date", ">=", startDate),
    where("date", "<=", endDate)
  );
  return onSnapshot(q, (snap) => {
    const dates = new Set<string>();
    snap.docs.forEach((d) => {
      const data = d.data() as CompletionDoc;
      if (data.date) dates.add(data.date);
    });
    onData(dates);
  });
}

export function subscribePartnerCompletionToday(
  partnerId: string | null,
  date: string,
  onData: (completed: boolean) => void
): Unsubscribe {
  if (!partnerId) {
    onData(false);
    return () => {};
  }
  const id = completionId(partnerId, date);
  return onSnapshot(completionRef(id), (snap) => {
    onData(snap.exists());
  });
}

export function subscribeMyCompletionToday(
  userId: string,
  date: string,
  onData: (completed: boolean) => void
): Unsubscribe {
  const id = completionId(userId, date);
  return onSnapshot(completionRef(id), (snap) => {
    onData(snap.exists());
  });
}

// Invites: find user by email (we need to query users by email; Firestore doesn't support this directly without an index)
// Workaround: store invites with toUserEmail; when partner signs in we look up invites where toUserEmail == currentUser.email
export function invitesToEmailRef() {
  return collection(getDb(), INVITES);
}

export function inviteRef(id: string) {
  return doc(getDb(), INVITES, id);
}

export async function createInvite(fromUserId: string, toUserEmail: string) {
  const id = `${fromUserId}_${toUserEmail.toLowerCase()}_${Date.now()}`;
  await setDoc(inviteRef(id), {
    id,
    fromUserId,
    toUserEmail: toUserEmail.toLowerCase().trim(),
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return id;
}

export async function getPendingInvitesForEmail(email: string): Promise<InviteDoc[]> {
  const q = query(
    collection(getDb(), INVITES),
    where("toUserEmail", "==", email.toLowerCase().trim()),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as InviteDoc);
}

/** Acceptor updates their own doc and the invite. Inviter updates their doc via listener. */
export async function acceptInvite(invite: InviteDoc, acceptorUid: string): Promise<void> {
  const batch = writeBatch(getDb());
  const toRef = userRef(acceptorUid);
  batch.update(toRef, { partnerId: invite.fromUserId });
  batch.update(inviteRef(invite.id), { status: "accepted", acceptorUid });
  await batch.commit();
}

/** Subscribe to invites you sent that were accepted; when one appears, set your partnerId. */
export function subscribeAcceptedInvitesFromMe(
  myUid: string,
  onAccepted: (partnerUid: string) => void
): Unsubscribe {
  const q = query(
    collection(getDb(), INVITES),
    where("fromUserId", "==", myUid),
    where("status", "==", "accepted")
  );
  return onSnapshot(q, (snap) => {
    for (const d of snap.docs) {
      const data = d.data() as InviteDoc & { acceptorUid?: string };
      if (data.acceptorUid) onAccepted(data.acceptorUid);
    }
  });
}

/** Send a partner invite by email. Partner sees it when they sign in and can accept to link. */
export async function linkPartnerByEmail(myUid: string, partnerEmail: string): Promise<void> {
  const normalized = partnerEmail.toLowerCase().trim();
  if (!normalized) throw new Error("Please enter an email.");
  await createInvite(myUid, normalized);
}
