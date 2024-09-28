import { Address } from 'viem';

export interface IVotingContext {
  loader: boolean
  error: string
  candidateArray: any[]
  voterArray: any[]
  candidateLength: string
  voterLength: string
  setLoader: (loader: boolean) => void
  uploadToIPFS: (flie: File) => Promise<string>
  setError: (loader: string) => void
  getNewCandidate: () => void
  giveVote: (id) => void
  uploadToIPFSCandidate: (file: File) => Promise<string>
  getAllVoterData: () => void
}