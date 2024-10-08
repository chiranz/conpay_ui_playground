'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import MyEscrows from '@/components/MyEscrows'

export default function EscrowsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const walletAddress = params.walletAddress as string
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('resolved') === 'true') {
      setFilter('resolved')
    } else if (searchParams.get('disputed') === 'true') {
      setFilter('disputed')
    } else if (searchParams.get('live') === 'true') {
      setFilter('live')
    } else {
      setFilter(null)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {filter ? `${filter.charAt(0).toUpperCase() + filter.slice(1)} Escrows` : 'All Escrows'}
      </h1>
      <MyEscrows account={walletAddress} filter={filter} />
    </div>
  )
}