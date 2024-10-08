import { NextApiRequest, NextApiResponse } from 'next'
import { dummyEscrows } from '@/data/dummyEscrows'
import { Escrow } from '@/types/escrow'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Escrow[] | { message: string }>
) {
  const { method, query } = req

  if (method === 'GET') {
    try {
      let filteredEscrows = dummyEscrows

      // Filter based on query parameters
      if (query.status) {
        filteredEscrows = filteredEscrows.filter(escrow => escrow.status.toLowerCase() === query.status)
      }

      if (query.direction) {
        filteredEscrows = filteredEscrows.filter(escrow => escrow.direction === query.direction)
      }

      // Simulate delay to mimic real API call
      setTimeout(() => {
        res.status(200).json(filteredEscrows)
      }, 500)
    } catch (error) {
      console.error('Error fetching escrows:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${method} Not Allowed` })
  }
}