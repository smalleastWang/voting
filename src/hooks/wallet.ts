import { useAccount, useWriteContract } from 'wagmi'
import { localChains } from '@/utils/wallet';
import Env from '@/utils/Env';
import { Abi, Address } from 'viem';
import { Chain } from '@rainbow-me/rainbowkit';
import { votingAbi } from '@/context/constants';


// type MyWriteContractMutateAsync = Omit<WriteContractMutateAsync<Config, unknown>, 'abi', address>
interface MyWriteContractParameters {
  abi?: Abi
  functionName: string
  address?: Address
  chain?: Chain
  account?: Address
  args?: any[]
}

export function useMyContract () {
  const { writeContractAsync, writeContract } = useWriteContract()
  const { address: accountAddress } = useAccount()
  const _writeContractAsync = (params: MyWriteContractParameters) => {
    return writeContractAsync({
      abi: votingAbi,
      address: Env.votingAddress,
      chain: localChains,
      account: accountAddress,
      ...params,
    })
  }
  const _writeContract = (params: MyWriteContractParameters) => {
    return writeContract({
      abi: votingAbi,
      address: Env.votingAddress,
      chain: localChains,
      account: accountAddress,
      ...params,
    })
  }
  return {
    writeContract: _writeContract,
    writeContractAsync: _writeContractAsync,
  }
}
