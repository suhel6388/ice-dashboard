import { useState, useRef, useEffect } from "react";
import {
  FiChevronDown,
  FiUploadCloud,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiX,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";


import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { useForm  } from "react-hook-form";
import Loaderspin from "../components/Loader"
import toast,{Toaster} from "react-hot-toast";

const CLASSES = [
  "ADCA",
  "DCFA",
  "DCA",
  "CCC",
  "O Level",
];
const EXAMS = ["Half Yearly Exam", "Annual Exam", "Unit Test 1", "Unit Test 2"];
const SESSIONS = ["2022-23", "2023-24", "2024-25", "2025-26"];







/* ── Reusable Input Field ───────────────────────────────────────────── */
function InputField({ label, value, onChange, placeholder, type = "text", icon: Icon, required, name }) {
  const [focused, setFocused] = useState(false);




  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors duration-200
              ${focused ? "text-teal-500" : "text-teal-300"}`}
          />
        )}
      
        <input
          type={type}
          value={value}
        
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-teal-50/40 border border-teal-200 rounded-xl py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all
            ${Icon ? "pl-9 pr-3.5" : "px-3.5"}`}
        />
      </div>
    </div>
  );
}
/* ── Reusable Select Field ───────────────────────────────────────────── */
function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div className="mb-4 ">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-teal-50/40 border border-teal-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 cursor-pointer outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none text-base" />
      </div>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────────────── */
export default function UploadResult() {
  const [classVal, setClassVal] = useState("");
  const [exam,     setExam]     = useState("");
  const [session,  setSession]  = useState("2023-24");
  const [file,     setFile]     = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null);
  const fileRef = useRef();
  const navigate = useNavigate()
     const {
    register,
    watch,
    getValues,
    handleSubmit,
    setValue,
    formState: {isSubmitting, errors },
    reset
  } = useForm();
 
     // calculate percentage 
  const total = watch("total_mark");
const obtain = watch("obtain_mark");



useEffect(() => {
  if (total && obtain) {
    const per = ((obtain / total) * 100).toFixed(2);
    setValue("percentage", per);
  }
}, [total, obtain]);


  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.match(/\.(csv|xlsx|xls|pdf)$/i)) {
      showToast("Only Excel, CSV or PDF files are allowed.", "error");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10MB.", "error");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };



  const handleCancel = () => {
    setClassVal("");
    setExam("");
    setSession("2025-26");
    setFile(null);
    setToast(null);

  };
const onSubmit = (data) =>{
    setLoading(true)
    if (errors) {
      showToast("Please fill all require field", "error")
      
    }
    else{
showToast("Form Submitted Successfully", "success");

    }
    setLoading(false)
    console.log(data);
    
  }

  const onError = () => {
        toast.error("Please fill all required fields");
      };

  return (
    <div className=" w-full h-screen  bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 flex items-center justify-center px-10 pt-72  fixed  overflow-y-auto ">
      <Toaster/>
      <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-xl shadow-teal-100/60 border border-teal-100 px-10 py-20 ">

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-7 relative">
          <IoArrowBackCircle color="emrald" cursor={'pointer'} onClick={()=> navigate(-1)} size={40} className="absolute left-0 " />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white text-xl shadow-md shadow-teal-200">
            <HiOutlineAcademicCap />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Upload Result
          </h1>
        </div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* Dropdowns */}
        <SelectField
        {...register("course",{
          required:"Course Name is require"
        })}
          label="Class / Course"
       onChange={(val) => setValue("course", val)}
        
          options={CLASSES}
          placeholder="Select class / course"
        />
             {errors.course && (
          <p className="text-red-500 text-sm mt-1">
            {errors.course.message}
          </p>
        )}
        <InputField
         {...register("course_duration",{
          required:"Course duration "
         })}
          label="Course Duration(In months)"
           onChange={(val) => setValue("course_duration", val)}
        
          placeholder="Course Duration"
        />
              {errors.course_duration && (
          <p className="text-red-500 text-sm mt-1">
            {errors.course_duration.message}
          </p>
        )}
        <InputField
        
          label="Year / Session (Ex-2026 0r 2025-26)"
       
           {...register("session",
            {
              required:"Session year is mandatory"
            }
           )}

           onChange={(val) => setValue("session", val)}
        
          placeholder="Select session"
        />

             {errors.session && (
          <p className="text-red-500 text-sm ">
            {errors.session.message}
          </p>
        )}
        <InputField 
        label='Student Name'
        placeholder={'Enter Student Name'}
         {...register('student_name',
          {
            required:"Student Name is require"
          }
         )}
         onChange={(val) =>{
          setValue(
            "student_name",
            val.replace(/\b\w/g, (char) =>
              char.toUpperCase()
            )
          )
         }}
       
        />

        
             {errors.student_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.student_name.message}
          </p>
        )}

         <InputField 
        label='Father Name'
        placeholder={'Enter Father Name'}
        {...register('father_name')}
                 value={watch("father_name") || ""}
  onChange={(val) => setValue("father_name", val)}
       
        />
              {errors.father_name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.father_name.message}

          </p>
        )}
         <InputField 
        label='Total marks'
        placeholder={'Enter Total marks'}
      
        {...register('total_mark')}
         value={watch("total_mark") || ""}
  onChange={(val) => setValue("total_mark", val)}
        />
            {errors.total_mark && (
          <p className="text-red-500 text-sm mt-1">
            {errors.total_mark.message}
          </p>
        )}

          <InputField 
        label='Obtain marks'
        placeholder={'Enter Obtain marks'}
         {...register('obtain_mark')}
           value={watch("obtain_mark") || ""}
  onChange={(val) => setValue("obtain_mark", val)}
      
        />
        {errors.obtain_mark && (
          <p className="text-red-500 text-sm mt-1">
            {errors.obtain_mark.message}
          </p>
        )}

           <InputField 
        label='Percentage %'
        placeholder={'Enter Student Percentage %'}
           
         {...register('percentage',
          {
            required:"Percentage"
          }
         )}
         value={`${watch("percentage") || ""}`}
          value={`${watch("percentage") || ""}%`}
  readOnly
       
        />

         {errors.percentage && (
          <p className="text-red-500 text-sm mt-1">
            {errors.percentage.message}
          </p>
        )}


                  <InputField 
        label='Grade'
        placeholder={'Enter Grade'}
        {...register('grade')}
      
        />

        
         {errors.grade && (
          <p className="text-red-500 text-sm mt-1">
            {errors.grade.message}
          </p>
        )}





        {/* Drop Zone */}
        <div className="mb-5">
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-teal-700 mb-1.5">
            Upload Result File
          </label>
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            
            className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200
              ${dragging
                ? "border-teal-500 bg-teal-50"
                : "border-teal-200 bg-teal-50/30 hover:bg-teal-50 hover:border-teal-400"
              }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.csv,.pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <FiUploadCloud className="text-4xl text-teal-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              <span className="text-teal-600 font-semibold">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400">Excel, CSV or PDF up to 10MB</p>

            {file && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-3 flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 text-sm text-teal-700 font-medium"
              >
                <FiFileText className="shrink-0" />
                <span className="flex-1 truncate text-left">{file.name}</span>
                <FiX
                  className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => setFile(null)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Result Preview */}

        
       

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
          type="button"
          
            onClick={()=> reset()}
            className="py-2.5 rounded-xl border border-teal-200 bg-white text-teal-700 text-sm font-semibold hover:bg-teal-50 active:scale-95 transition-all duration-150"
          >
            Cancel
          </button>
          <button
         onClick={() => {
    console.log(getValues());
  }
        }
          
           
            disabled={loading}
            className={`py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 active:scale-95
              ${loading
                ? "bg-emerald-700 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-md shadow-teal-200"
              }`}
          >
            <FiUploadCloud className="text-base" />
            {loading ? `Uploading... ${<Loaderspin/>}` : "Upload Result"}
          </button>
        
        </div>
        </form>
        

        {/* Toast Notification */}
        {toast && (
          <div
            className={`mt-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all
              ${toast.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
              }`}
          >
            {toast.type === "success"
              ? <FiCheckCircle className="text-base shrink-0" />
              : <FiXCircle className="text-base shrink-0" />
            }
            {toast.msg}
          </div>



        )}
      </div>
    </div>
  );
}