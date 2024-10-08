"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Escrow, UserStats } from "@/types/escrow";
import { useUserStats } from "@/hooks/useUserStats";

const MAX_TRUST_SCORE = 100;

export default function UserProfilePage() {
  const params = useParams<{ walletAddress: string }>();
  const walletAddress = params?.walletAddress;

  const { userStats, isLoading, error } = useUserStats(walletAddress);

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-primary">Loading...</div>;
  }

  if (error || !walletAddress) {
    return (
      <div className="flex items-center justify-center h-64 text-primary">{error || "Invalid wallet address"}</div>
    );
  }

  if (!userStats) {
    return <div className="flex items-center justify-center h-64 text-primary">No data available</div>;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-primary">User Profile</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Trust Score"
          value={userStats.trustScore}
          total={MAX_TRUST_SCORE}
          icon={<Shield className="w-8 h-8 text-blue-500" />}
          link={`/escrows/${walletAddress}`}
        />
        <StatCard
          title="Resolved Escrows"
          value={userStats.resolvedEscrows}
          total={userStats.totalEscrows}
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
          link={`/escrows/${walletAddress}?resolved=true`}
        />
        <StatCard
          title="Disputed Escrows"
          value={userStats.disputedEscrows}
          total={userStats.totalEscrows}
          icon={<AlertCircle className="w-8 h-8 text-red-500" />}
          link={`/escrows/${walletAddress}?disputed=true`}
        />
        <StatCard
          title="Live Escrows"
          value={userStats.liveEscrows}
          total={userStats.totalEscrows}
          icon={<Clock className="w-8 h-8 text-yellow-500" />}
          link={`/escrows/${walletAddress}?live=true`}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  total: number;
  icon: React.ReactNode;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, total, icon, link }) => (
  <Link href={link}>
    <div className="flex items-center justify-between p-6 transition-shadow duration-300 rounded-lg shadow-lg bg-card hover:shadow-xl">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-primary">{title}</h2>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-primary">{value}</p>
          <span className="ml-1 text-sm text-gray-500">/{total}</span>
        </div>
      </div>
      <div className="text-secondary">{icon}</div>
    </div>
  </Link>
);
