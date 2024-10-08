import React, { useState, useEffect } from 'react'
import { ArrowDownLeft, ArrowUpRight, Loader } from 'lucide-react'
import EscrowDetailsModal from './EscrowDetailsModal'
import { Escrow } from '@/types/escrow'

interface MyEscrowsProps {
  account: string
  filter: string | null
}

const MyEscrows: React.FC<MyEscrowsProps> = ({ account, filter }) => {
  const [escrows, setEscrows] = useState<Escrow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEscrow, setSelectedEscrow] = useState<Escrow | null>(null)

  useEffect(() => {
    const fetchEscrows = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let url = `/api/escrows?account=${account}`
        if (filter) {
          url += `&status=${filter}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch escrows')
        }

        const data = await response.json()
        setEscrows(data)
      } catch (err) {
        console.error('Failed to fetch escrows:', err)
        setError('Failed to fetch escrows. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEscrows()
  }, [account, filter])

  const handleEscrowClick = (escrow: Escrow) => {
    setSelectedEscrow(escrow)
  }

  const closeModal = () => {
    setSelectedEscrow(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Locked':
        return 'bg-yellow-500'
      case 'Disputed':
        return 'bg-red-500'
      case 'Resolving':
        return 'bg-blue-500'
      case 'Resolved':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const calculateProgress = (escrow: Escrow) => {
    const now = Date.now()
    const total = escrow.releaseTime - escrow.createdAt
    const elapsed = now - escrow.createdAt
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={48} />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div className="space-y-4">
      {escrows.map((escrow) => (
        <div
          key={escrow.id}
          className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleEscrowClick(escrow)}
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-semibold text-primary">Escrow #{escrow.id}</h3>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getStatusColor(escrow.status)}`}></span>
                <p className="text-secondary">{escrow.status}</p>
              </div>
            </div>
            <div className="flex items-center">
              {escrow.direction === 'in' ? (
                <ArrowDownLeft className="text-green-500 mr-2" />
              ) : (
                <ArrowUpRight className="text-red-500 mr-2" />
              )}
              <span className="text-lg font-bold text-primary">{escrow.amount} ETH</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress(escrow)}%` }}
            ></div>
          </div>
        </div>
      ))}
      {selectedEscrow && (
        <EscrowDetailsModal escrow={selectedEscrow} onClose={closeModal} />
      )}
    </div>
  )
}

export default MyEscrows