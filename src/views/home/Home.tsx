import { useEffect, useContext } from "react";
import Countdown from "react-countdown";

//INTERNAL IMPORT
import { VotingContext } from "@/context/Voter";
import Style from "./home.module.scss";
import Card from "@/components/Card/Card";
import { useAccount } from 'wagmi';

const Home = () => {
  const { address } = useAccount()
  const {
    getNewCandidate,
    candidateArray,
    giveVote,
    candidateLength,
    getAllVoterData,
    voterLength,
  } = useContext(VotingContext);

  useEffect(() => {
    if (address) {
      getNewCandidate();
      getAllVoterData();
    }
  }, [address]);

  return (
    <div className={Style.home}>
      {address && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              No Candidate:<span>{candidateLength}</span>
            </div>
            <div className={Style.candidate_list}>
              No Voter:<span>{voterLength}</span>
            </div>
          </div>
          <div className={Style.winner_message}>
            <Countdown date={Date.now() + 1000000000} />
          </div>
        </div>
      )}

      <Card candidateArray={candidateArray} giveVote={giveVote} />
    </div>
  );
};

export default Home;
