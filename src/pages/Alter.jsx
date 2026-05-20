import React, { useState } from "react";
import { FiSearch, FiEdit, FiBell } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiCalendar,
  FiChevronDown,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import EditStudentCard from "./Alter/EditStudentCard";
import SearchStudent from "./Alter/Student_List";
import { IoArrowBackCircle } from "react-icons/io5";
import { Pointer } from "lucide-react";

const studentsData = [
  { id: 1, name: "Md Suhel", course: "ADCA", mobile: "9999999999", reg: "REG12345" },
  { id: 2, name: "Ayesha Khan", course: "DCA", mobile: "8888888888", reg: "REG12346" },
  { id: 3, name: "Rohit Kumar", course: "Tally Prime", mobile: "7777777777", reg: "REG12347" },
  { id: 4, name: "Neha Sharma", course: "ADCA", mobile: "6666666666", reg: "REG12348" },
  { id: 5, name: "Arman Ali", course: "DCA", mobile: "5555555555", reg: "REG12349" },
];

export default function Alter() {
  const [selected, setSelected] = useState(studentsData[0]);
const navigate  = useNavigate()
  return (
    <div className="p-6 bg-gray-100 min-h-screen h-96 overflow-y-auto ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-semibold flex justify-center items-center gap-6">  <IoArrowBackCircle color="blue" cursor={'pointer'} onClick={()=> navigate(-1)} size={40}/> Alter Student</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow">
            <FiSearch />
            <input
              type="text"
              placeholder="Search anything..."
              className="ml-2 outline-none"
            />
          </div>
          <FiBell size={20} />
          <div className="flex items-center gap-2">
            <FaUserCircle size={28}  />
            <div>
              <p className="text-sm font-medium">Suhel Ali</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <SearchStudent/>


        {/* Right Panel */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow  ">
          <EditStudentCard/>

        
        </div>
      </div>
    </div>
  );
}
