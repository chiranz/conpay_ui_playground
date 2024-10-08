import React, { useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react'

interface EscrowEvent {
  type: 'created' | 'funded' | 'disputed' | 'resolving' | 'resolved'
  date: number
  status: 'past' | 'future' | 'potential' | 'skipped'
}

interface Escrow {
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

interface EscrowDetailsModalProps {
  escrow: Escrow
  onClose: () => void
}

const EscrowDetailsModal: React.FC<EscrowDetailsModalProps> = ({ escrow, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const now = Date.now()

  const events: EscrowEvent[] = [
    { type: 'created', date: escrow.createdAt, status: 'past' },
    { type: 'funded', date: escrow.fundedAt, status: 'past' },
    { 
      type: 'disputed', 
      date: escrow.disputeAt || escrow.releaseTime, 
      status: escrow.disputeAt ? 'past' : 
              (escrow.status === 'Locked' && escrow.canBeDisputed) ? 'potential' : 
              'skipped'
    },
    { 
      type: 'resolving', 
      date: escrow.resolvingAt || escrow.releaseTime + 86400000, // 1 day after release time
      status: escrow.resolvingAt ? 'past' : 
              (escrow.status === 'Disputed') ? 'future' : 
              'skipped'
    },
    { 
      type: 'resolved', 
      date: escrow.resolvedAt || escrow.releaseTime,
      status: escrow.resolvedAt ? 'past' : 'future'
    },
  ]

  // Filter out skipped events
  const filteredEvents = events.filter(event => event.status !== 'skipped')

  const getEventIcon = (type: string, status: string) => {
    const baseClass = `w-8 h-8 rounded-full flex items-center justify-center ${
      status === 'past' ? 'bg-blue-500' : 
      status === 'future' ? 'bg-gray-700' : 
      status === 'potential' ? 'bg-yellow-500' :
      'bg-gray-600'
    }`
    
    switch (type) {
      case 'created':
      case 'funded':
      case 'resolving':
        return <div className={baseClass}><Clock className="w-5 h-5 text-white" /></div>
      case 'disputed':
        return <div className={baseClass}><AlertCircle className="w-5 h-5 text-white" /></div>
      case 'resolved':
        return <div className={baseClass}><CheckCircle className="w-5 h-5 text-white" /></div>
      default:
        return null
    }
  }

  const getEventTitle = (type: string, status: string) => {
    const baseClass = `text-lg font-semibold ${
      status === 'past' ? 'text-blue-500' : 
      status === 'future' ? 'text-gray-400' : 
      status === 'potential' ? 'text-yellow-500' :
      'text-gray-600'
    }`
    
    let title = type.charAt(0).toUpperCase() + type.slice(1)
    if (status === 'potential') title += ' (Potential)'
    if (status === 'skipped') title += ' (Skipped)'
    
    return <span className={baseClass}>{title}</span>
  }

  const handleAction = (action: string) => {
    // Implement action logic here
    console.log(`Performing action: ${action}`)
    // You would typically call a function to interact with the smart contract here
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div ref={modalRef} className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-white">Escrow Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-300">ID: {escrow.id}</p>
          <p className="text-gray-300">Amount: {escrow.amount} ETH</p>
          <p className="text-gray-300">Direction: {escrow.direction === 'in' ? 'Incoming' : 'Outgoing'}</p>
          <p className="text-gray-300">Status: {escrow.status}</p>
          <p className="text-gray-300">Can be disputed: {escrow.canBeDisputed ? 'Yes' : 'No'}</p>
        </div>
        <h3 className="text-xl font-semibold mb-4 text-white">Timeline</h3>
        <div className="space-y-6 mb-6">
          {filteredEvents.map((event, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-4 flex flex-col items-center">
                {getEventIcon(event.type, event.status)}
                {index < filteredEvents.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-700 my-1"></div>
                )}
              </div>
              <div className="flex-grow">
                {getEventTitle(event.type, event.status)}
                <p className="text-gray-400">{new Date(event.date).toLocaleString()}</p>
                {event.type === 'created' && (
                  <p className="text-gray-400 mt-1">Additional details about the created stage can be displayed here.</p>
                )}
              </div>
              <ArrowRight className="text-gray-500 ml-2 mt-1" />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4 sticky bottom-0 bg-gray-900 pt-4">
          {escrow.status === 'Locked' && (
            <>
              <button 
                onClick={() => handleAction('release')} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Release
              </button>
              {escrow.canBeDisputed && (
                <button 
                  onClick={() => handleAction('dispute')} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Dispute
                </button>
              )}
            </>
          )}
          {escrow.status === 'Disputed' && (
            <button 
              onClick={() => handleAction('resolve')} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Resolve
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EscrowDetailsModal