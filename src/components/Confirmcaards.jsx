import React from "react";
import { motion } from "framer-motion";
import { FaTrashAlt } from "react-icons/fa";
const ConfirmCard = ({
  label = "Are you sure?",
  onYes,
  onNo,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      
      {/* Card */}
      <div className="bg-white w-[350px] rounded-2xl shadow-2xl p-6">
        
        {/* Label */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {label}
        </h2>

        {/* Buttons */}
        <div className="flex justify-center gap-5">
          
          {/* Yes Button */}
          <button
            onClick={onYes}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl transition"
          >
            Yes
          </button>

          {/* No Button */}
          <button
            onClick={onNo}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition"
          >
            No
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmCard;