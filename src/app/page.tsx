import Image from 'next/image'
import Link from 'next/link'
import { Shield, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-8">
          Welcome to <span className="text-blue-500">Web3 Escrow</span>
        </h1>
        <p className="mt-3 text-xl sm:text-2xl mb-8 max-w-2xl">
          Secure, transparent, and decentralized escrow services on the blockchain.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/create" className="w-full sm:w-64 p-6 mt-6 text-left border border-gray-700 rounded-xl hover:border-blue-500 transition-colors duration-150 ease-in-out">
            <h3 className="text-2xl font-bold flex items-center text-blue-500">
              Create Escrow <ArrowRight className="ml-2" size={24} />
            </h3>
            <p className="mt-4 text-xl">
              Set up a new escrow agreement with customizable terms.
            </p>
          </Link>

          <Link href="/my-escrows" className="w-full sm:w-64 p-6 mt-6 text-left border border-gray-700 rounded-xl hover:border-blue-500 transition-colors duration-150 ease-in-out">
            <h3 className="text-2xl font-bold flex items-center text-blue-500">
              My Escrows <ArrowRight className="ml-2" size={24} />
            </h3>
            <p className="mt-4 text-xl">
              View and manage your existing escrow agreements.
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}