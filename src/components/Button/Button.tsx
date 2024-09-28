//INTERNAL IMPORT
import Style from "./Button.module.scss";

const Button = ({ classStyles, btnName, handleClick }) => (
  <button className={Style.button} type="button" onClick={handleClick}>
    {btnName}
  </button>
);

export default Button;
