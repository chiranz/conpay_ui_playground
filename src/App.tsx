import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from './components/Navbar'
import ConnectWallet from './components/ConnectWallet'
import CreateEscrow from './components/CreateEscrow'
import MyEscrows from './components/MyEscrows'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [networkError, setNetworkError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState('create')

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
            await checkNetwork(provider)
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error)
        }
      }
    }

    checkConnection()

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        checkConnection()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', checkConnection)
      }
    }
  }, [])

  const checkNetwork = async (provider: ethers.providers.Web3Provider) => {
    const network = await provider.getNetwork()
    setNetworkError(network.chainId !== 1)
  }

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const accounts = await provider.listAccounts()
        setIsConnected(true)
        setAccount(accounts[0])
        setProvider(provider)
        await checkNetwork(provider)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const switchToMainnet = async () => {
    if (!provider) return

    setIsLoading(true)
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://mainnet.infura.io/v3/YOUR-PROJECT-ID'],
                blockExplorerUrls: ['https://etherscan.io']
              }
            ],
          })
        } catch (addError) {
          console.error('Failed to add Ethereum network', addError)
          alert('Failed to add Ethereum network. Please try again or add it manually in your wallet.')
        }
      } else {
        console.error('Failed to switch to the Ethereum network:', error)
        alert('Failed to switch to the Ethereum network. Please try again or switch manually in your wallet.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar isConnected={isConnected} onConnect={handleConnect} onNavigate={handleNavigate} />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-8">Web3 Escrow Dapp</h1>
        {!isConnected ? (
          <ConnectWallet onConnect={handleConnect} />
        ) : (
          <div className="w-full max-w-2xl">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              {networkError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="mr-2" size={20} />
                      <span>Please switch to Ethereum Mainnet.</span>
                    </div>
                    <button
                      onClick={switchToMainnet}
                      disabled={isLoading}
                      className={`bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded flex items-center text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <RefreshCw className="mr-1 animate-spin" size={16} />
                      ) : (
                        <RefreshCw className="mr-1" size={16} />
                      )}
                      Switch to Mainnet
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {currentPage === 'create' && <CreateEscrow provider={provider} />}
                  {currentPage === 'myEscrows' && <MyEscrows account={account} />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App