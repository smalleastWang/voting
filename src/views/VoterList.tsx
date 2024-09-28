import { useEffect, useContext } from "react";

import VoterCard from "@/components/VoterCard/VoterCard";
import Style from "../styles/voterList.module.scss";

import { VotingContext } from "../context/Voter";
import { useAccount } from 'wagmi';

const VoterList = () => {
  const { address } = useAccount()
  const { getAllVoterData, voterArray } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
  }, [getAllVoterData, address]);

  return (
    <div className={Style.voterList}>
      <VoterCard voterArray={voterArray} />
    </div>
  );
};

export default VoterList;
