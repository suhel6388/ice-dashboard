import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const BackButton = ({
 
  className = "",
  size = 40
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
     
    >
      <IoArrowBackCircleSharp color="blue" size={size}/>
     
    </button>
  );
};

export default BackButton;