"use client";

import { useState } from "react";
import { updateUserTaskName } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  uid: string;
  currentTaskName: string;
  onSaved: () => void;
};

export function TaskNameForm({
  uid,
  currentTaskName,
  onSaved,
}: Props) {
  const [value, setValue] = useState(currentTaskName);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = value.trim();
    if (!name) {
      toast.error("Enter a task name.");
      return;
    }
    setLoading(true);
    try {
      await updateUserTaskName(uid, name);
      toast.success("Task name saved.");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="taskName">Your daily task</Label>
        <Input
          id="taskName"
          placeholder="e.g. Leetcode, Exercise, Read 30 min"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
