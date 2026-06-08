import React, { useState, useEffect } from 'react';
import { GrClose } from "react-icons/gr";
import { supabase_client } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Loader from './Loader';
import generateStudentID from '../components/Student_id';
import LoadingSpinner from './Loadingspiner';
import generateInstallments from '../utils/functions/generateInstallments';

const Addstudent = ({ close }) => {

  const today = new Date().toISOString().split("T")[0];

  const [studennt_id, setStudenntId] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // ✅ Bug 3 Fixed — setValue("student_id") so watch() can read it
  useEffect(() => {
    const loadID = async () => {
      setLoading(true);
      const id = await generateStudentID();
      setLoading(false);
      setStudenntId(id);
      setValue("student_id", id); // ✅ sync with react-hook-form
    };
    loadID();
  }, []);

  const course_fee = watch("course_fee");
  const deposit_fee = watch("deposit_fee");
  const due = (Number(course_fee) || 0) - (Number(deposit_fee) || 0);

  // ✅ Bug 2 Fixed — generateInstallments now called inside onSubmit
  // after student is successfully saved to DB
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Step 1: Insert student
      const { error } = await supabase_client
        .from('register_students')
        .insert([{ ...data, due_fee: due }]);

      if (error) {
        toast.error(error.message, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        toast.success("Student Registered ✅");

        // Step 2: Generate installments AFTER student is saved
        if (data.no_of_installment && Number(data.no_of_installment) > 0) {
          await generateInstallments(
            data.student_id,
            parseInt(data.no_of_installment)
          );
        }

        reset();
        // Reload a new student ID after reset
        const newId = await generateStudentID();
        setStudenntId(newId);
        setValue("student_id", newId);
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  const onError = () => {
    toast.error("Please fill all required fields ⚠️");
  };

  return (
    <div
      data-aos='zoom-in'
      className="min-h-screen fixed inset-0 z-50 flex items-center justify-center backdrop-blur-3xl overflow-y-scroll"
    >
      <div className='absolute bottom-20% left-2'>
        <Toaster position="bottom-left" />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm h-[200vh]">
          <div className="flex flex-col items-center gap-3 fixed top-60">
            <LoadingSpinner />
          </div>
        </div>
      )}

      <div
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244, 114, 182, 0.25), transparent 70%), #000000",
        }}
        className="min-h-screen w-1/2 grid grid-rows-1 grid-cols-1 items-center justify-items-center
          bg-clip-padding backdrop-filter bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 py-10
          rounded-sm backdrop-blur-lg bg-white/10 border gap-10 pt-36 mt-80 relative"
      >
        <h1 className='text-4xl font-semibold bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-teal-500 via-purple-500 to-red-500 text-transparent bg-clip-text h-fit'>
          Registration Form
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="shadow-xl p-6 w-full grid grid-cols-2 gap-5 text-white"
        >
          {/* ✅ Bug 4 Fixed — close icon not inside submit button */}
          <GrClose
            cursor={'pointer'}
            onClick={close}
            size={20}
            className='absolute top-20 right-8'
          />

          {/* Student ID */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Student ID</label>
            <input
              {...register("student_id")}
              value={studennt_id || ""}
              readOnly
              type="text"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
          </div>

          {/* Student Name */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Student Name</label>
            <input
              {...register("s_name", { required: "Name is required" })}
              onChange={(e) => setValue("s_name", e.target.value.toLocaleUpperCase())}
              type="text"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.s_name && <p className="text-red-500">{errors.s_name.message}</p>}
          </div>

          {/* Father Name */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Father Name</label>
            <input
              {...register("f_name", { required: "Father Name is required" })}
              onChange={(e) => setValue("f_name", e.target.value.toLocaleUpperCase())}
              type="text"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.f_name && <p className="text-red-500">{errors.f_name.message}</p>}
          </div>

          {/* Mother Name */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Mother Name</label>
            <input
              {...register("m_name", { required: "Mother Name is required" })}
              onChange={(e) => setValue("m_name", e.target.value.toLocaleUpperCase())}
              type="text"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.m_name && <p className="text-red-500">{errors.m_name.message}</p>}
          </div>

          {/* DOB */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">DOB</label>
            <input
              {...register("dob", { required: "DOB is required" })}
              onChange={(e) => setValue("dob", e.target.value)}
              type="date"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Select Gender</label>
            <div className='flex gap-0 justify-center'>
              {["Male", "Female", "Other"].map((item) => (
                <label key={item} className="flex items-center gap-1 justify-center text-gray-400 px-2 rounded-md outline-none bg-transparent">
                  <input
                    className='w-4 h-4 gap-2'
                    type="radio"
                    value={item}
                    {...register("gender", { required: "Please select gender" })}
                    onChange={(e) => setValue("gender", e.target.value)}
                  />
                  {item}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Mob Number</label>
            <input
              {...register("mob", { required: "Mobile number is required" })}
              onChange={(e) => setValue("mob", e.target.value)}
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.mob && <p className="text-red-500">{errors.mob.message}</p>}
          </div>

          {/* Address */}
          <div className="flex flex-col col-span-2">
            <label className="text-xl mb-1 text-gray-200">Address</label>
            <textarea
              {...register("address", { required: "Address is required" })}
              onChange={(e) => setValue("address", e.target.value)}
              rows="3"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2 resize-none"
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Course */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Course</label>
            <input
              {...register("course", { required: "Course Name is required" })}
              onChange={(e) => setValue("course", e.target.value.toLocaleUpperCase())}
              type="text"
              list='courseList'
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            <datalist id="courseList">
              <option value="ADCA" />
              <option value="DFCA" />
              <option value="DCA" />
              <option value="TALLY PRIME" />
              <option value="DTP" />
              <option value="EXCEL" />
              <option value="EXCEL+WORD" />
              <option value="MS OFFICE" />
              <option value="PYTHON" />
              <option value="WEB DESIGN" />
              <option value="O LEVEL" />
            </datalist>
            {errors.course && <p className="text-red-500">{errors.course.message}</p>}
          </div>

          {/* Course Duration */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Course Duration</label>
            <select
              {...register("course_duration", { required: "Course duration is required" })}
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            >
              <option value="">Select Duration</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="12 Months">12 Months</option>
            </select>
            {errors.course_duration && <p className="text-red-500">{errors.course_duration.message}</p>}
          </div>

          {/* Admission Fee */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Admission Fee</label>
            <input
              {...register("add_fee", { required: "Admission fee is required" })}
              onChange={(e) => setValue("add_fee", e.target.value)}
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.add_fee && <p className="text-red-500">{errors.add_fee.message}</p>}
          </div>

          {/* Admission Date */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Admission Date</label>
            <input
              {...register("admision_date", { required: "Admission date is required" })}
              onChange={(e) => setValue("admision_date", e.target.value)}
              type="date"
              defaultValue={today}
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.admision_date && <p className="text-red-500">{errors.admision_date.message}</p>}
          </div>

          {/* Course Fee */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Course Fee</label>
            <input
              {...register("course_fee", { required: "Course fee is required" })}
              onChange={(e) => setValue("course_fee", e.target.value)}
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.course_fee && <p className="text-red-500">{errors.course_fee.message}</p>}
          </div>

          {/* Deposit Fee — ✅ Bug 1 Fixed: was setting course_fee by mistake */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Deposit Fee Amount</label>
            <input
              {...register("deposit_fee", { required: "Deposit fee is required (add 0 at least)" })}
              onChange={(e) => setValue("deposit_fee", e.target.value)} // ✅ fixed
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.deposit_fee && <p className="text-red-500">{errors.deposit_fee.message}</p>}
          </div>

          {/* Due Fee — auto calculated */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Due Fee</label>
            <input
              readOnly
              {...register("due_fee")}
              value={isNaN(due) ? 0 : due}
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
          </div>

          {/* No of Installments */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">No of Installments</label>
            <input
              {...register("no_of_installment", { required: "No of installments required" })}
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.no_of_installment && <p className="text-red-500">{errors.no_of_installment.message}</p>}
          </div>

          {/* Buttons */}
          <div className="btn flex justify-center items-center w-full h-15 gap-10 absolute bottom-2 font-medium">

            {/* ✅ Bug 4 Fixed — type="button" so it doesn't trigger form submit */}
            <button
              type='button'
              onClick={close}
              className="flex justify-center items-center col-span-2 mt-3 bg-white text-black hover:bg-gray-100 active:bg-emerald-300 transition py-2 rounded backdrop-blur-md relative w-32 h-10"
            >
              Back
            </button>

            {/* ✅ Bug 2 Fixed — no handleGenerate here, it's inside onSubmit now */}
            <button
              type='submit'
              disabled={loading}
              className="flex justify-center items-center col-span-2 mt-3 bg-blue-500/70 hover:bg-blue-600/80 transition py-2 rounded backdrop-blur-md relative w-32 h-10"
            >
              {loading ? "Saving..." : "Submit"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default Addstudent;