'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import MyEscrows from '@/components/MyEscrows'
import ConnectWallet from '@/components/ConnectWallet'

export default function MyEscrowsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setIsConnected(true)
            setAccount(accounts[0])
            setProvider(provider)
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error)
        }
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await provider.listAccounts()
        setIsConnected(true)
        setAccount(accounts[0])
        setProvider(provider)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">My Escrows</h1>
      {!isConnected ? (
        <ConnectWallet onConnect={handleConnect} />
      ) : (
        <MyEscrows account={account} filter={null} />
      )}
    </div>
  )
}