export interface Escrow {
  id: string
  amount: string
  direction: 'in' | 'out'
  status: 'Locked' | 'Disputed' | 'Resolving' | 'Resolved'
  createdAt: number
  fundedAt: number
  disputeAt?: number
  resolvingAt?: number
  releaseTime: number
  resolvedAt?: number
  canBeDisputed: boolean
}