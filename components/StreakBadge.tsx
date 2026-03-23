"use client";
import { useState, useEffect } from "react";
import { loadStreak, updateStreak } from "@/lib/streak";

interface Props {
  streakKey: string;
  triggerUpdate?: boolean;
}

export function StreakBadge({ streakKey, triggerUpdate = false }: Props) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const s = loadStreak(streakKey);
    setStreak(s.count);
  }, [streakKey]);

  useEffect(() => {
    if (triggerUpdate) {
      const s = updateStreak(streakKey);
      setStreak(s.count);
    }
  }, [triggerUpdate, streakKey]);

  if (streak <= 0) return null;

  return (
    <span
      className="ml-2 text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold"
      aria-label={`${streak}日連続利用中`}
    >
      {streak}日連続
    </span>
  );
}
