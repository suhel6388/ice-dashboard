import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForm,  } from "react-hook-form";
import { supabase_client } from "../../utils/supabaseClient";
import toast, { Toaster } from 'react-hot-toast';
import LoadingSpinner from "../../components/Loadingspiner";

const AddExpense = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async(data) => {
    setLoading(true)
    console.log("Expense Data:", data);

    // API call or state update here
    try {
      const {error} = await supabase_client
      .from("add_expenses")
      .insert([data])
      if (error) {
              toast.error(error.message, {
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              })
      
      
            }
             else {
            toast.success("Add expenses succesfully! ");
            reset();
          }
      
    } 
  
      
    catch (error) {
       toast.error("Please fill all required fields ");
      
    }
    setLoading(false)

   
  };
   const onError = () => {
      toast.error("Please fill all required fields ⚠️");
    };
    
  

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center overflow-y-auto p-4">
       <div p className='absolute bottom-20% left-2'> <Toaster position="bottom-left" /></div>

        {loading === true && 
                 <div className="fixed inset-0 z-50 flex  justify-center bg-black/40 backdrop-blur-sm h-[200vh]">
      
            <div className="flex flex-col items-center gap-3 fixed top-60">
              <LoadingSpinner/>
      
            </div>
      
          </div>
                  }





      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-md p-6 space-y-5">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <IoArrowBackCircleSharp
            size={30}
            color="blue"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
          {/* Expense Title */}
          <div>
            <label className="text-sm text-gray-600">
              Expense Title
            </label>
            <input
              type="text"
              placeholder="Enter expense title"
              {...register("title", {
                required: "Expense title is required",
              })}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">
                Category
              </label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                <option value="Stationary">Stationary</option>
                <option value="Salary">Salary</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 1,
                    message: "Amount must be greater than 0",
                  },
                })}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              />

              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          {/* Date & Payment Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <div className="flex items-center border rounded-lg mt-1 px-3">
                <input
                  type="date"
                  {...register("date", {
                    required: "Date is required",
                  })}
                  className="w-full p-3 outline-none"
                />
                <FaCalendarAlt className="text-gray-400" />
              </div>

              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Payment Mode
              </label>
              <select
                {...register("paymentMode", {
                  required: "Payment mode is required",
                })}
                className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
              </select>

              {errors.paymentMode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMode.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-600">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter description (optional)"
              {...register("description")}
              className="w-full mt-1 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;