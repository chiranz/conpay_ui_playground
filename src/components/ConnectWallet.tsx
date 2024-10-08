import React from 'react'
import { Wallet } from 'lucide-react'

interface ConnectWalletProps {
  onConnect: () => void
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  return (
    <button
      onClick={onConnect}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-lg"
    >
      <Wallet className="mr-2" size={24} />
      Connect Wallet
    </button>
  )
}

export default ConnectWallet