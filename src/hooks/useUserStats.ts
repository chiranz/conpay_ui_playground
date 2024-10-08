import { useState, useEffect } from "react";
import { Escrow, UserStats } from "@/types/escrow";

export function useUserStats(walletAddress: string | undefined) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!walletAddress) {
        setError("No wallet address provided");
        setIsLoading(false);
        return;
      }

      try {
        // Use relative URL and add a timestamp to prevent caching
        const response = await fetch(`/api/escrows?account=${walletAddress}&_=${Date.now()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const escrows: Escrow[] = await response.json();
        const stats = calculateUserStats(escrows);
        setUserStats(stats);
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setError("Failed to fetch user stats. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [walletAddress]);

  return { userStats, isLoading, error };
}

function calculateUserStats(escrows: Escrow[]): UserStats {
  const stats: UserStats = {
    trustScore: 0,
    resolvedEscrows: 0,
    disputedEscrows: 0,
    liveEscrows: 0,
    totalEscrows: escrows.length,
  };

  escrows.forEach((escrow) => {
    switch (escrow.status) {
      case "Resolved":
        stats.resolvedEscrows++;
        break;
      case "Disputed":
        stats.disputedEscrows++;
        break;
      case "Locked":
      case "Resolving":
        stats.liveEscrows++;
        break;
    }
  });

  const resolvedRatio = stats.resolvedEscrows / stats.totalEscrows;
  stats.trustScore = Math.round((resolvedRatio * 100 + (1 - stats.disputedEscrows / stats.totalEscrows) * 100) / 2);

  return stats;
}
