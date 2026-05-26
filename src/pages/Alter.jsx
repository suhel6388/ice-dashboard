import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

import { FaUserGraduate } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { supabase_client } from "../utils/supabaseClient";
import Addstudent from "../components/Addstudent";
import FeesAdd from "../components/Fees_Add";
import LoadingSpinner from "../components/Loadingspiner";

export default function Alter() {
  const [loading, setLoading] = useState(false);
  
const [isopen, setIsopen] = useState("");

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch Students
  const fetchStudents = async () => {
    setLoading(true)

    const { data, error } = await supabase_client
      .from("register_students")
      .select("*");

    if (error) {
      console.log(error.message);
    } else {
      setStudents(data);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter Search
  const filteredStudents = students.filter((item) => {

    const text = search.toLowerCase();

    return (
      item?.s_name?.toLowerCase().includes(text) ||
      item?.student_id?.toString().includes(text) ||
      item?.mob?.includes(text) ||
      item?.course?.toLowerCase().includes(text)
    );
  });

  // Delete Student
  const deleteStudent = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    const { error } = await supabase_client
      .from("register_students")
      .delete()
      .eq("student_id", id);

    if (error) {
      alert(error.message);
    } else {
      fetchStudents();
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6">
        

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-4">

            <IoArrowBackCircle
              size={40}
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate(-1)}
            />

            <div className="flex items-center gap-3">

              <FaUserGraduate className="text-blue-600 text-3xl" />

              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Student Details
                </h1>

                <p className="text-sm text-gray-500">
                  Manage all registered students
                </p>
              </div>

            </div>

          </div>

          {/* Right */}
          <div className="flex items-center gap-4 flex-wrap">

            {/* Search */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl">

              <FiSearch className="text-gray-500" />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none ml-2"
              />

            </div>

            {/* Add Button */}
            <button
              onClick={() => setIsopen("register")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition"
            >

              <FiPlus size={20} />

              Add Student

            </button>

          </div>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">
          {loading === true &&(
            <LoadingSpinner/>
          )}

          <table className="w-full text-sm text-left">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="px-5 py-4">Student ID</th>
                <th className="px-5 py-4">Student Name</th>
                <th className="px-5 py-4">Father Name</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Mobile</th>
                <th className="px-5 py-4">Admission Date</th>
                <th className="px-5 py-4">Due Fee</th>
                <th className="px-5 py-4 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredStudents.length > 0 ? (

                filteredStudents.map((student, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="px-5 py-4 font-medium">
                      {student.student_id}
                    </td>

                    <td className="px-5 py-4">
                      {student.s_name}
                    </td>

                    <td className="px-5 py-4">
                      {student.f_name}
                    </td>

                    <td className="px-5 py-4">
                      {student.course}
                    </td>

                    <td className="px-5 py-4">
                      {student.mob}
                    </td>

                    <td className="px-5 py-4">
                      {student.admision_date}
                    </td>

                    <td className="px-5 py-4 text-red-600 font-semibold">
                      ₹ {student.due_fee}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() =>
                            navigate(`/alter-student/${student.student_id}`)
                          }
                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition"
                        >

                          <FiEdit size={18} />

                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            deleteStudent(student.student_id)
                          }
                          className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"
                        >

                          <FiTrash2 size={18} />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500"
                  >

                    No Students Found

                  </td>

                </tr>

              )}

            </tbody>

          </table>
           </div>
      

               {isopen === 'register' &&(
                        <Addstudent close={()=> setIsopen('')} />
                    )}
      {isopen === 'fee_add' &&(
                        <FeesAdd close={()=> setIsopen('')} />
                    )}


                   
    </div>

        </div>

     

    
  );
}