import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient } from '@tanstack/react-query';
import { name as appName } from '@/../package.json';
import { Abi, Address, defineChain } from 'viem';
import { readContract } from 'wagmi/actions';
import Env from './Env';
import { Config, UseReadContractParameters } from 'wagmi';
import { votingAbi } from '@/context/constants';
import { mainnet } from 'wagmi/chains';


interface MyReadContractParameters {
  abi?: Abi
  functionName?: string
  address?: Address
  args?: any[]
  config?: Config
  selectData?: UseReadContractParameters
}

export const localChains: Chain = defineChain({
  id: 31337,
  name: 'localhost',
  nativeCurrency: {
    name: "GO",
    symbol: "GO",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545/'],
      webSocket: ['http://127.0.0.1:8545/'],
    }
  },
})

export const walletConfig = getDefaultConfig({
  appName: appName,
  projectId: appName,
  chains: [
    localChains,
    mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base
  ],
  ssr: true,
});

export const queryClient = new QueryClient();

export function getVotingMessage(functionName: string, other?: MyReadContractParameters) {
  return readContract(walletConfig, {
    address: Env.votingAddress,
    abi: votingAbi,
    functionName,
    ...other
  })
} 



