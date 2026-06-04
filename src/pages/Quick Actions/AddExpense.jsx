import React from "react";
import { FiUploadCloud } from "react-icons/fi";
import { FaCalendarAlt } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
const AddExpense = () => {
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors },
    } = useForm();



    const navigate = useNavigate() 
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center  overflow-y-auto  ">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-md p-6  space-y-5">
       
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 flex">
           <IoArrowBackCircleSharp size={30} color="blue" onClick={()=> navigate(-1)}/>
          Add New Expense
        </h2>

        {/* Expense Title */}
        <div>
          <label className="text-sm text-gray-600">Expense Title</label>
          <input
            type="text"
            placeholder="Enter expense title"
            className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Category & Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500">
              <option>Select Category</option>
              <option>Stationary</option>
              <option>Salary</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Amount (₹)</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Date & Payment Mode */}
        <div className="grid grid-cols-2 gap-4">
          
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <div className="flex items-center border rounded-lg mt-1 px-3">
              <input
                type="date"
                className="w-full p-3 outline-none"
              />
              <FaCalendarAlt className="text-gray-400" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Payment Mode</label>
            <select className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500">
              <option>Select Mode</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Bank</option>
            </select>
          </div>

        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            rows="3"
            placeholder="Enter description (optional)"
            className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>


        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300" onClick={()=> navigate(-1)}>
            Cancel
          </button>
          <button className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
            Save Expense
          </button>
        </div>

      </div>
    </div>
  );
};



export default AddExpense;