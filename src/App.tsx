import '@rainbow-me/rainbowkit/styles.css';
import './styles/global.scss'
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/layout/Layout";
// import Home from "@/views/home/Home";
import { NoMatch } from "@/views/NoMatch";

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, walletConfig } from './utils/wallet';
import CandidateRegisration from './views/candidateRegisration';
import { VotingProvider } from './context/Voter';
import Home from './views/home/Home';
import VoterList from './views/VoterList';
import AllowedVoters from './views/AllowedVoters';


// function MyLazy(load: Promise<{ default: ComponentType<any> }>) {
//   const Content = lazy(() => load);
//   return <Suspense fallback={<div>loading...</div>}><Content /></Suspense>
// }

function App() {
  // const routeElement = useRoutes(routes)
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <VotingProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* <Route index element={MyLazy(import("@/views/home/Home"))} /> */}
                <Route index element={<Home />} />
                <Route path='candidate-regisration' element={<CandidateRegisration />} />
                <Route path='allowed-voters' element={<AllowedVoters />} />
                <Route path='voter-list' element={<VoterList />} />
              </Route>
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </VotingProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
