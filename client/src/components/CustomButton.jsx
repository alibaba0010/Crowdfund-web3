import PropTypes from "prop-types";

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

CustomButton.propTypes = {
  btnType: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
  styles: PropTypes.string,
};

export default CustomButton;
