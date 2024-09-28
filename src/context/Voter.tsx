import React, { useState } from "react";
import { uploadToIPFSApi } from '@/api/voter';
import Env from '@/utils/Env';
import { IVotingContext } from './voting';
import { getVotingMessage } from '@/utils/wallet';
import { useMyContract } from '@/hooks/wallet';
import { useAccount } from 'wagmi';

export const VotingContext = React.createContext<IVotingContext>({} as IVotingContext);

export const VotingProvider = ({ children }) => {
  const {writeContractAsync} = useMyContract()
  const {address} = useAccount()
  const [candidateLength, setCandidateLength] = useState("");
  const [loader, setLoader] = useState(false);
  const [candidateArray, setCandidateArray] = useState<any[]>([]);

  const [error, setError] = useState("");

  const [voterArray, setVoterArray] = useState<any[]>([]);
  const [voterLength, setVoterLength] = useState("");

  const uploadToIPFS = async (file) => {
    let ImgHash = '';
    if (!file) return ImgHash;
    try {
      if (address) {
        setLoader(true);
        const data = await uploadToIPFSApi(file)
        ImgHash = `${location.protocol}//${data.Location}`;
      } else {
        console.log("Kindly connect to your wallet");
      }
    } catch (error) {
      console.log("Unable to upload image to Pinata", error);
    } finally {
      setLoader(false);
    }
    return ImgHash;
  };

  const uploadToIPFSCandidate = async (file: File) => {
    let ImgHash = '';
    if (!file) return ImgHash;
    try {
      setLoader(true);
      const data = await uploadToIPFSApi(file)
      ImgHash = `${location.protocol}//${data.Location}`;
    } catch (error) {
      console.log("Unable to upload image to Pinata", error);
    } finally {
      setLoader(false);
    }
    return ImgHash;
  };


  const getAllVoterData = async () => {
    try {
      if (address) {
        const voterListData: any = await getVotingMessage('getVoterList')

        const items = await Promise.all(
          voterListData.map(async (el) => {
            const singleVoterData = await getVotingMessage('getVoterData', {args: [el]});
            return {
              voterID: singleVoterData[0]?.toNumber(),
              name: singleVoterData[1],
              image: singleVoterData[4],
              voterVote: singleVoterData[5]?.toNumber(),
              ipfs: singleVoterData[2],
              address: singleVoterData[3],
              votingStatus: singleVoterData[6],
            };
          })
        );
        setVoterArray(items);

        //VOTER LENGHT
        const voterList = await getVotingMessage('getVoterLength');
        setVoterLength(voterList.toString());
      } else {
        setError("Connect to wallet");
      }
    } catch (error) {
      console.log(error)
      setError("Something went wrong");
    }
  };

  const giveVote = async (id) => {
    try {
      if (address == Env.votingAddress)
        return setError("Owner Can not give vote");
      setLoader(true);
      const voterAddress = id.address;
      const voterId = id.id;


      await writeContractAsync({
        functionName: 'vote',
        args: [voterAddress, voterId]
      })

      setLoader(false);
      window.location.reload();
    } catch (error) {
      console.log(error)
      setError("Sorry!, You have already voted, Reload Browser");
      setLoader(false);
    }
  };

  const getNewCandidate = async () => {
    if (address) {
      setError('');
      const allCandidate: any = await getVotingMessage('getCandidate');
      const items = await Promise.all(
        allCandidate.map(async (el) => {
          const singleCandidateData = (await getVotingMessage('getCandidateData', { args: [el] }));
          return {
            age: singleCandidateData[0],
            name: singleCandidateData[1],
            candidateID: Number(singleCandidateData[2]),
            image: singleCandidateData[3],
            totalVote: Number(singleCandidateData[4]),
            ipfs: singleCandidateData[5],
            address: singleCandidateData[6],
          };
        })
      );
      console.log(items,'items')

      setCandidateArray(items);

      const allCandidateLength = await getVotingMessage('getCandidateLength');
      setCandidateLength(allCandidateLength.toString());
    } else {
      setError("Connect to wallet");
    }
  };

  return (
    <VotingContext.Provider
      value={{
        uploadToIPFS,
        getNewCandidate,
        giveVote,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        error,
        setError,
        candidateLength,
        voterLength,
        loader,
        setLoader,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
