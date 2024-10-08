export interface Escrow {
  id: string;
  amount: string;
  direction: "in" | "out";
  status: "Locked" | "Disputed" | "Resolving" | "Resolved";
  createdAt: number;
  fundedAt: number;
  disputeAt?: number;
  resolvingAt?: number;
  releaseTime: number;
  resolvedAt?: number;
  canBeDisputed: boolean;
}

export interface UserStats {
  trustScore: number;
  resolvedEscrows: number;
  disputedEscrows: number;
  liveEscrows: number;
  totalEscrows: number;
}
