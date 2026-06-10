
import React, { useState, useEffect } from 'react';
import { GrClose } from "react-icons/gr";
import { supabase_client  } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Loader from './Loader';




import generateStudentID from '../components/Student_id'
import LoadingSpinner from './Loadingspiner';
import { FaCalendarAlt } from 'react-icons/fa';
import Installmentupdate from '../utils/functions/Payinstallment';

const FeesAdd = ({ close }) => {


  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();


  

  const studentID = watch("student_id");
  const Feeamount = watch("fee_amt")

  const [loading, setLoading] = useState(false);

  // =========================
  // SEARCH STUDENT
  // =========================

  const handleSearch = async (id) => {

    if (!id?.trim()) return;

    const toastId = toast.loading("Searching Student...");

    try {

      const { data, error } = await supabase_client
        .from("register_students")
        .select("*")
        .eq("student_id", id)
        .maybeSingle();

      toast.dismiss(toastId);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data) {
        toast.error("Student not found!");
        return;
      }

      toast.success("Student Found");

      // Autofill
      setValue("s_name", data.s_name || "");
      setValue("course", data.course || "");
      setValue("mob", data.mob || "");

    } catch (error) {

      toast.dismiss(toastId);
      toast.error("Something went wrong");

    }
  };

  // =========================
  // AUTO SEARCH
  // =========================

  useEffect(() => {

    if (studentID?.length >= 8) {
      handleSearch(studentID);
    }

  }, [studentID]);

  // =========================
  // SUBMIT
  // =========================

  const onSubmit = async (formData) => {

    setLoading(true);

    const toastId = toast.loading("Submitting Fee...");

    try {

      // =========================
      // INSERT FEE
      // =========================

      const { error: insertError } = await supabase_client
        .from("add_fee")
        .insert([formData]);

      if (insertError) {

        toast.dismiss(toastId);

        toast.error(insertError.message);

        setLoading(false);

        return;
      }

      // =========================
      // GET STUDENT DATA
      // =========================

      const {
        data: studentData,
        error: studentError,
      } = await supabase_client
        .from("register_students")
        .select("*")
        .eq("student_id", formData.student_id)
        .single();

      if (studentError) {

        toast.dismiss(toastId);

        toast.error(studentError.message);

        setLoading(false);

        return;
      }

      // =========================
      // SAFE CALCULATION
      // =========================

      const totalFee =
        Number(studentData?.total_fee ?? 0);

      const currentDepositFee =
        Number(studentData?.deposit_fee ?? 0);

      const feeAmount =
        Number(formData?.fee_amt ?? 0);

      const newDepositFee =
        currentDepositFee + feeAmount;

      const newDueFee =
  newDepositFee - newDepositFee;

   

      // =========================
      // UPDATE STUDENT TABLE
      // =========================

      const { error: updateError } = await supabase_client
        .from("register_students")
        .update({
          deposit_fee: newDepositFee,
          due_fee: newDueFee,
        })
        .eq("student_id", formData.student_id);

      toast.dismiss(toastId);
      Installmentupdate(studentID, Number(feeAmount))
      reset()

      if (updateError) {

        toast.error(updateError.message);


        setLoading(false);

        return;
      }

      toast.success("Fee Added Successfully");

      reset();

    } catch (error) {

      toast.dismiss(toastId);

      toast.error("Something went wrong!");

      console.log(error);

    }

    setLoading(false);
  };

  return (
    <div
      data-aos="flip-left"
      className="min-h-screen fixed inset-0 z-50 flex items-center justify-center 
      bg-black/40 backdrop-blur-sm"
    >

      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244,114,182,0.25), transparent 70%), #000000",
        }}
        className="min-h-screen w-full sm:w-4/5 md:w-2/3 lg:w-1/2 
        flex flex-col items-center justify-center p-4 sm:p-5
        rounded-sm backdrop-blur-lg bg-white/10 border overflow-y-auto"
      >

        <h1
          className="text-2xl sm:text-4xl font-semibold 
          bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))]
          from-teal-500 via-purple-500 to-red-500
          text-transparent bg-clip-text mb-4"
        >
          Deposit Fee
        </h1>

        <Toaster position="top-right" reverseOrder={false} />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative shadow-xl p-4 sm:p-6 w-full max-w-[600px]
          grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-white"
        >

          <GrClose
            onClick={close}
            className="absolute top-2 right-2 cursor-pointer"
          />

          {/* Student ID */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Student ID
            </label>

            <input
              {...register("student_id", {
                required: "Student ID is required",
              })}
              onChange={(e) =>
                setValue(
                  "student_id",
                  e.target.value.toUpperCase()
                )
              }
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.student_id && (
              <p className="text-red-500 text-sm">
                {errors.student_id.message}
              </p>
            )}

          </div>

          {/* Student Name */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Student Name
            </label>

            <input
              {...register("s_name", {
                required: "Student Name is required",
              })}
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.s_name && (
              <p className="text-red-500 text-sm">
                {errors.s_name.message}
              </p>
            )}

          </div>

          {/* Fee Amount */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Fee Amount
            </label>

            <input
              {...register("fee_amt", {
                required: "Fee Amount is required",
              })}
              type="number"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.fee_amt && (
              <p className="text-red-500 text-sm">
                {errors.fee_amt.message}
              </p>
            )}

          </div>

          {/* Course */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Course
            </label>

            <input
              {...register("course", {
                required: "Course is required",
              })}
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.course && (
              <p className="text-red-500 text-sm">
                {errors.course.message}
              </p>
            )}

          </div>

          {/* Date */}
          <div className="flex flex-col relative">

            <label className="text-xl mb-1 text-gray-200">
              Date
            </label>

            <input
             
              {...register("date", {
                required: "Date is required",
              })}
              type="date"
              className="glass-input text-gray-400 rounded-md outline-none bg-transparent border-2 px-4 py-2 pr-10"
            />

            <FaCalendarAlt
              onClick={() => dateRef.current?.showPicker()}
              className="absolute right-3 top-1/2 translate-y-1 cursor-pointer text-gray-400"
            />

            {errors.date && (
              <p className="text-red-500 text-sm">
                {errors.date.message}
              </p>
            )}

          </div>

          {/* Receipt No */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Receipt No
            </label>

            <input
              {...register("receipt_no", {
                required: "Receipt No is required",
              })}
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.receipt_no && (
              <p className="text-red-500 text-sm">
                {errors.receipt_no.message}
              </p>
            )}

          </div>

          {/* Submit By */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Submit By
            </label>

            <input
              {...register("submit_by", {
                required: "Submit By is required",
              })}
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.submit_by && (
              <p className="text-red-500 text-sm">
                {errors.submit_by.message}
              </p>
            )}

          </div>

          {/* Mobile */}
          <div className="flex flex-col">

            <label className="text-xl mb-1 text-gray-200">
              Mobile
            </label>

            <input
              {...register("mob", {
                required: "Mobile number is required",
              })}
              type="text"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2"
            />

            {errors.mob && (
              <p className="text-red-500 text-sm">
                {errors.mob.message}
              </p>
            )}

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="col-span-1 sm:col-span-2 mt-2 bg-blue-500/70 hover:bg-blue-600/80 transition py-2 rounded-xl"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default FeesAdd;