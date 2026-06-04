import React, { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { supabase_client } from "../../utils/supabaseClient";

// ─── Simple inline spinner (no extra import needed) ───────────────────────────
const LoadingSpinner = () => (
  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
);

const today = new Date().toISOString().split("T")[0];

// ─────────────────────────────────────────────────────────────────────────────
const UpdateStudents = ({ close} ) => {
  const [loading, setLoading] = useState(false);          // ✅ single declaration
  const [searchId, setSearchId] = useState("");           // ✅ controlled search input
  const [studentFound, setStudentFound] = useState(false);



  const {
    register,
    watch,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // ─── Live due-fee calculation ───────────────────────────────────────────────
  const course_fee   = Number(watch("course_fee")  || 0);
  const deposit_fee  = Number(watch("deposit_fee") || 0);
  const due          = course_fee - deposit_fee;           // ✅ correct formula

  // Keep due_fee field in sync with react-hook-form
  useEffect(() => {
    setValue("due_fee", due);
  }, [due, setValue]);

  // ─── Search student by ID ───────────────────────────────────────────────────
  const handleSearch = async (id) => {
    if (!id?.trim()) return;

    const toastId = toast.loading("Searching student…");
    setLoading(true);

    try {
      const { data, error } = await supabase_client
        .from("register_students")
        .select("*")
        .eq("student_id", id.trim())
        .maybeSingle();

      toast.dismiss(toastId);

      if (error)  { toast.error(error.message); return; }
      if (!data)  { toast.error("Student not found!"); setStudentFound(false); return; }

      toast.success("Student found");
      setStudentFound(true);

      // ✅ Autofill all fields from DB
      setValue("student_id",    data.student_id    || "");
      setValue("s_name",        data.s_name        || "");
      setValue("f_name",        data.f_name        || "");
      setValue("m_name",        data.m_name        || "");
      setValue("dob",           data.dob           || "");
      setValue("gender",        data.gender        || "");
      setValue("course",        data.course        || "");
      setValue("add_fee",       data.add_fee       || "");
      setValue("admision_date", data.admision_date || today);
      setValue("course_fee",    data.course_fee    || "");
      setValue("deposit_fee",   data.deposit_fee   || "");
      setValue("due_fee",       data.due_fee       || "");
      setValue("mob",           data.mob           || "");
      setValue("address",       data.address       || "");

    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when ID reaches 8 characters
  useEffect(() => {
    if (searchId.length >= 8) handleSearch(searchId);
  }, [searchId]);

  // ─── Submit → UPDATE register_students ─────────────────────────────────────
  const onSubmit = async (formData) => {
    if (!studentFound) {
      toast.error("Please search and load a student first.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating student…");

    try {
      const { error: updateError } = await supabase_client
        .from("register_students")
        .update({
          s_name:        formData.s_name,
          f_name:        formData.f_name,
          m_name:        formData.m_name,
          dob:           formData.dob,
          gender:        formData.gender,
          course:        formData.course,
          add_fee:       Number(formData.add_fee),
          admision_date: formData.admision_date,
          course_fee:    Number(formData.course_fee),
          deposit_fee:   Number(formData.deposit_fee),
          due_fee:       due,                          // ✅ computed value
          mob:           formData.mob,
          address:       formData.address,
        })
        .eq("student_id", formData.student_id);

      toast.dismiss(toastId);

      if (updateError) {
        toast.error(updateError.message);
        return;
      }

      toast.success("Student updated successfully!");
      reset();
      setSearchId("");
      setStudentFound(false);

    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div
      data-aos="zoom-in"
      className="min-h-screen fixed inset-0 z-50 flex items-center justify-center backdrop-blur-3xl overflow-y-scroll"
    >
      <div className="absolute bottom-20% left-2">
        <Toaster position="bottom-left" />
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 fixed top-60">
            <LoadingSpinner />
          </div>
        </div>
      )}

      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(244, 114, 182, 0.25), transparent 70%), #000000",
        }}
        className="min-h-screen w-1/2 grid grid-rows-1 grid-cols-1 items-center justify-items-center
          bg-clip-padding backdrop-filter bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 py-10
          rounded-sm backdrop-blur-lg bg-white/10 border gap-10 pt-36 mt-80 relative"
      >
        <h1 className="text-4xl font-semibold bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-teal-500 via-purple-500 to-red-500 text-transparent bg-clip-text h-fit">
          Update Student
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}   
          className="shadow-xl p-6 w-full grid grid-cols-2 gap-5 text-white"
        >
          <GrClose
            cursor="pointer"
            onClick={close}
            size={20}
            className="absolute top-20 right-8"
          />

          {/* ── Search by Student ID ── */}
          <div className="flex flex-col col-span-2">
            <label className="text-xl mb-1 text-gray-200">
              Search by Student ID
            </label>
            <div className="flex gap-2">
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}

                type="text"
                placeholder="Enter Student ID to load data…"
                className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2 flex-1"
              />
              <button
                type="button"
                onClick={() => handleSearch(searchId)}
                className="px-4 py-1 bg-purple-600 hover:bg-purple-700 rounded-md transition text-white"
              >
                Search
              </button>
            </div>
          </div>

          {/* Hidden student_id for form submission */}
          <input type="hidden" {...register("student_id")} />

          {/* Student Name */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Student Name</label>
            <input
              {...register("s_name", { required: "Name is required" })}
              onChange={(e) => setValue("s_name", e.target.value.toUpperCase())}
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
              onChange={(e) => setValue("f_name", e.target.value.toUpperCase())}
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
              onChange={(e) => setValue("m_name", e.target.value.toUpperCase())}
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
              type="date"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Select Gender</label>
            <div className="flex gap-0 justify-center">
              {["Male", "Female", "Other"].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-1 justify-center text-gray-400 px-2 rounded-md outline-none bg-transparent"
                >
                  <input
                    className="w-4 h-4"
                    type="radio"
                    value={item}
                    {...register("gender", { required: "Please select gender" })}
                  />
                  {item}
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-red-500">{errors.gender.message}</p>}
          </div>

          {/* Course */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Course</label>
            <input
              {...register("course", { required: "Course Name is required" })}
              onChange={(e) => setValue("course", e.target.value.toUpperCase())}
              type="text"
              list="courseList"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            <datalist id="courseList">
              {["ADCA","DFCA","DCA","TALLY PRIME","DTP","EXCEL","EXCEL+WORD","MS OFFICE","PYTHON","WEB DESIGN"].map(
                (c) => <option key={c} value={c} />
              )}
            </datalist>
            {errors.course && <p className="text-red-500">{errors.course.message}</p>}
          </div>

          {/* Admission Fee */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Admission Fee</label>
            <input
              {...register("add_fee", { required: "Admission fee is required" })}
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
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.course_fee && <p className="text-red-500">{errors.course_fee.message}</p>}
          </div>

          {/* Deposit Fee */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Deposit Fee Amount</label>
            <input
              {...register("deposit_fee", { required: "Deposit fee is required (enter 0 at minimum)" })}
              type="number"                    
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2"
            />
            {errors.deposit_fee && <p className="text-red-500">{errors.deposit_fee.message}</p>}
          </div>

          {/* Due Fee (read-only, auto-calculated) */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Due Fee</label>
            <input
              readOnly
              {...register("due_fee")}
              value={due}                  
              type="number"
              className="glass-input text-gray-400 px-5 py-1 rounded-md outline-none bg-transparent border-2 opacity-70"
            />
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <label className="text-xl mb-1 text-gray-200">Mob Number</label>
            <input
              {...register("mob", { required: "Mobile number is required" })}
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
              rows="3"
              className="glass-input text-gray-400 px-5 py-2 rounded-md outline-none bg-transparent border-2 resize-none"
            />
            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
          </div>

          {/* Buttons */}
          <div className="btn flex justify-center items-center w-full h-15 gap-10 absolute bottom-2 font-medium">
            <button
              type="button"      
              onClick={close}
              className="flex justify-center items-center col-span-2 mt-3 bg-white text-black hover:bg-gray-100 active:bg-emerald-300 transition py-2 rounded backdrop-blur-md relative w-32 h-10"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center col-span-2 mt-3 bg-blue-500/70 hover:bg-blue-600/80 transition py-2 rounded backdrop-blur-md relative w-32 h-10 disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudents;