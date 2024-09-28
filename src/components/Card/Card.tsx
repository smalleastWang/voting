import { cj } from '@/utils/tool';
import Style from "./card.module.scss";

const Card = ({ candidateArray, giveVote }) => {
  cj(Style.image)
  return (
    <div className={Style.card}>
      {candidateArray?.map((el) => (
        <div className={Style.card_box}>
          <div className={Style.image}>
            <img src={el?.image} alt="Profile photo" />
          </div>
          <div className={Style.card_info}>
            <h2 className='mv-20'>#{el?.candidateID}</h2>
            <p className='mv-20'>AGE: {el?.age}</p>
            <p className='mv-20'>Address: {el?.address.slice(0, 20)}..</p>
            <p className={cj(Style.total, 'mv-20')}>Total Vote</p>
          </div>

          <div className={Style.card_vote}>
            <p className='mv-20'>{el?.totalVote}</p>
          </div>

          <div className={Style.card_button}>
            <button
              onClick={() =>
                giveVote({ id: el?.candidateID, address: el?.address })
              }
            >
              Give Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
