'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { Escrow } from '@/types/escrow'

interface UserStats {
  trustScore: number
  resolvedEscrows: number
  disputedEscrows: number
  liveEscrows: number
  totalEscrows: number
}

const MAX_TRUST_SCORE = 100

export default function UserProfilePage() {
  const params = useParams()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/escrows?account=${params.walletAddress}`)
        if (!response.ok) {
          throw new Error('Failed to fetch escrows')
        }
        const escrows: Escrow[] = await response.json()
        const stats = calculateUserStats(escrows)
        setUserStats(stats)
      } catch (error) {
        console.error('Error fetching user stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStats()
  }, [params.walletAddress])

  const calculateUserStats = (escrows: Escrow[]): UserStats => {
    const stats: UserStats = {
      trustScore: 0,
      resolvedEscrows: 0,
      disputedEscrows: 0,
      liveEscrows: 0,
      totalEscrows: escrows.length
    }

    escrows.forEach(escrow => {
      switch (escrow.status) {
        case 'Resolved':
          stats.resolvedEscrows++
          break
        case 'Disputed':
          stats.disputedEscrows++
          break
        case 'Locked':
        case 'Resolving':
          stats.liveEscrows++
          break
      }
    })

    const resolvedRatio = stats.resolvedEscrows / stats.totalEscrows
    stats.trustScore = Math.round((resolvedRatio * 100 + (1 - stats.disputedEscrows / stats.totalEscrows) * 100) / 2)

    return stats
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-primary">Loading...</div>
  }

  if (!userStats) {
    return <div className="flex justify-center items-center h-64 text-primary">Failed to load user stats</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-primary">User Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Trust Score"
          value={userStats.trustScore}
          total={MAX_TRUST_SCORE}
          icon={<Shield className="w-8 h-8 text-blue-500" />}
          link={`/escrows/${params.walletAddress}`}
        />
        <StatCard
          title="Resolved Escrows"
          value={userStats.resolvedEscrows}
          total={userStats.totalEscrows}
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
          link={`/escrows/${params.walletAddress}?resolved=true`}
        />
        <StatCard
          title="Disputed Escrows"
          value={userStats.disputedEscrows}
          total={userStats.totalEscrows}
          icon={<AlertCircle className="w-8 h-8 text-red-500" />}
          link={`/escrows/${params.walletAddress}?disputed=true`}
        />
        <StatCard
          title="Live Escrows"
          value={userStats.liveEscrows}
          total={userStats.totalEscrows}
          icon={<Clock className="w-8 h-8 text-yellow-500" />}
          link={`/escrows/${params.walletAddress}?live=true`}
        />
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  total: number
  icon: React.ReactNode
  link: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, total, icon, link }) => (
  <Link href={link}>
    <div className="bg-card shadow-lg rounded-lg p-6 flex items-center justify-between hover:shadow-xl transition-shadow duration-300">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-primary">{title}</h2>
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-primary">{value}</p>
          <span className="text-sm text-gray-500 ml-1">/{total}</span>
        </div>
      </div>
      <div className="text-secondary">{icon}</div>
    </div>
  </Link>
)