import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Plus, Loader } from 'lucide-react'

interface CreateEscrowProps {
  provider: ethers.providers.Web3Provider | null
}

const ESCROW_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890' // Replace with actual contract address
const ESCROW_ABI = [
  'function createEscrow(address payable _recipient, uint256 _duration, string _description) payable'
]

const CreateEscrow: React.FC<CreateEscrowProps> = ({ provider }) => {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [duration, setDuration] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!provider) return

    try {
      setIsLoading(true)
      const signer = provider.getSigner()
      const escrowContract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, ESCROW_ABI, signer)

      const tx = await escrowContract.createEscrow(
        recipient,
        ethers.BigNumber.from(duration),
        description,
        { value: ethers.utils.parseEther(amount) }
      )

      await tx.wait()
      alert('Escrow created successfully!')
      setAmount('')
      setRecipient('')
      setDuration('')
      setDescription('')
    } catch (error) {
      console.error('Failed to create escrow:', error)
      alert('Failed to create escrow. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreateEscrow} className="space-y-6 max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Create New Escrow</h2>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
          Amount (ETH)
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input-field w-full"
          placeholder="0.1"
          required
        />
      </div>
      <div>
        <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="input-field w-full"
          placeholder="0x..."
          required
        />
      </div>
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
          Escrow Duration (in seconds)
        </label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="input-field w-full"
          placeholder="86400 (1 day)"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field w-full"
          placeholder="Describe the purpose of this escrow..."
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className={`btn-primary w-full flex justify-center items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin mr-2" size={20} />
        ) : (
          <Plus className="mr-2" size={20} />
        )}
        {isLoading ? 'Creating...' : 'Create Escrow'}
      </button>
    </form>
  )
}

export default CreateEscrow