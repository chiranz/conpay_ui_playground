import { Escrow } from '../types/escrow'

const now = Date.now()
const day = 86400000 // 1 day in milliseconds

export const dummyEscrows: Escrow[] = [
  {
    id: '1',
    amount: '0.5',
    direction: 'in',
    status: 'Locked',
    createdAt: now - 2 * day,
    fundedAt: now - 1.9 * day,
    releaseTime: now + 5 * day,
    canBeDisputed: true
  },
  {
    id: '2',
    amount: '1.2',
    direction: 'out',
    status: 'Disputed',
    createdAt: now - 5 * day,
    fundedAt: now - 4.8 * day,
    disputeAt: now - 2 * day,
    releaseTime: now + 2 * day,
    canBeDisputed: true
  },
  {
    id: '3',
    amount: '0.75',
    direction: 'in',
    status: 'Resolving',
    createdAt: now - 10 * day,
    fundedAt: now - 9.9 * day,
    disputeAt: now - 5 * day,
    resolvingAt: now - 2 * day,
    releaseTime: now + 1 * day,
    canBeDisputed: false
  },
  {
    id: '4',
    amount: '2.0',
    direction: 'out',
    status: 'Resolved',
    createdAt: now - 15 * day,
    fundedAt: now - 14.9 * day,
    releaseTime: now - 1 * day,
    resolvedAt: now - 1 * day,
    canBeDisputed: false
  },
  {
    id: '5',
    amount: '1.5',
    direction: 'in',
    status: 'Locked',
    createdAt: now - 3 * day,
    fundedAt: now - 2.9 * day,
    releaseTime: now + 4 * day,
    canBeDisputed: true
  },
  {
    id: '6',
    amount: '0.8',
    direction: 'out',
    status: 'Disputed',
    createdAt: now - 8 * day,
    fundedAt: now - 7.8 * day,
    disputeAt: now - 3 * day,
    releaseTime: now + 3 * day,
    canBeDisputed: true
  },
  {
    id: '7',
    amount: '3.0',
    direction: 'in',
    status: 'Resolving',
    createdAt: now - 12 * day,
    fundedAt: now - 11.9 * day,
    disputeAt: now - 6 * day,
    resolvingAt: now - 3 * day,
    releaseTime: now + 2 * day,
    canBeDisputed: false
  },
  {
    id: '8',
    amount: '1.8',
    direction: 'out',
    status: 'Resolved',
    createdAt: now - 20 * day,
    fundedAt: now - 19.9 * day,
    releaseTime: now - 2 * day,
    resolvedAt: now - 2 * day,
    canBeDisputed: false
  },
  {
    id: '9',
    amount: '0.6',
    direction: 'in',
    status: 'Locked',
    createdAt: now - 1 * day,
    fundedAt: now - 0.9 * day,
    releaseTime: now + 6 * day,
    canBeDisputed: true
  },
  {
    id: '10',
    amount: '2.5',
    direction: 'out',
    status: 'Locked',
    createdAt: now - 4 * day,
    fundedAt: now - 3.9 * day,
    releaseTime: now + 3 * day,
    canBeDisputed: true
  }
]