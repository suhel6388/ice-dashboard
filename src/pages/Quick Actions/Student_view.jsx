import { useRef, useState, useEffect } from "react";
import {
  FiEye,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiPhone,
  FiLoader,
} from "react-icons/fi";
import { supabase_client } from "../../utils/supabaseClient";


const search_filter = [
  "All Courses",
  "ADCA",
  "DCFA",
  "DCA",
  "TALLY",
  "MS OFFICE",
  "BCA",
  "MCA",
  "MBA",
  "B.Sc",
  "EXCEL",
  "EXCEL+WORD",
  "PYTHON",
  "WEB DESIGN",
];

const PER_PAGE = 5;

export default function Studentview() {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("All Courses");
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase_client
        .from("register_students")
        .select("sr_no, student_id, s_name, f_name, course, course_fee, deposit_fee, mob")
        .order("sr_no", { ascending: true });

      if (error) {
        setError("Failed to load students. Please try again.");
      } else {
        setStudents(data || []);
      }

      setLoading(false);
    };

    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    const matchQ =
      s.s_name?.toLowerCase().includes(q) ||
      s.student_id?.toString().includes(q) ||
      s.mob?.includes(q);
    const matchC = course === "All Courses" || s.course === course;
    return matchQ && matchC;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const courseColor = (c) => {
    const map = {
      "B.Tech": "bg-blue-100 text-blue-600",
      "M.Tech": "bg-violet-100 text-violet-600",
      BCA: "bg-cyan-100 text-cyan-600",
      MCA: "bg-green-100 text-green-600",
      MBA: "bg-orange-100 text-orange-600",
      ADCA: "bg-red-100 text-red-600",
      DCFA: "bg-pink-100 text-pink-600",
      DCA: "bg-yellow-100 text-yellow-600",
      "TALLY PRIME": "bg-amber-100 text-amber-600",
      "MS OFFICE": "bg-sky-100 text-sky-600",
      EXCEL: "bg-emerald-100 text-emerald-600",
      "EXCEL+WORD": "bg-teal-100 text-teal-600",
      PYTHON: "bg-indigo-100 text-indigo-600",
      "WEB DESIGN": "bg-fuchsia-100 text-fuchsia-600",
    };
    return map[c] || "bg-gray-100 text-gray-600";
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-3 sm:p-5">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
      

        <h2 className="text-lg font-bold text-gray-800 mb-5">Search Student</h2>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2 bg-gray-50">
            <FiSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name / ID / mobile"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          <div className="relative w-full sm:w-[180px]">
            <label htmlFor="courseSelect" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
              <FiFilter />
            </label>
            <select
              id="courseSelect"
              value={course}
              onChange={(e) => { setCourse(e.target.value); setPage(1); }}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 pr-10 bg-gray-50 outline-none text-sm text-gray-700 appearance-none"
            >
              {search_filter.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && (
          <p className=" flex justify-center items-center text-center text-gray-400 py-8 text-lg animate-pulse">Loading students... 
          <FiLoader color="blue" size={20}  className=" animate-spin text-white " />
         
                    
                    </p>
        )}
        {error && (
          <p className="text-center text-red-400 py-8 text-sm">{error}</p>
        )}

        {/* Desktop Table */}
        {!loading && !error && (
          <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">SR No.</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Student ID</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Student Name</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Father Name</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Course</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Course Fee</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Deposit Fee</th>
                  <th className="px-4 py-3 text-left text-gray-500 font-semibold">Mobile</th>
                  <th className="px-4 py-3 text-center text-gray-500 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-gray-400">
                      No students found..
                      
                    </td>
                  </tr>
                ) : (
                  // ✅ Fixed: was students.map — now paginated.map
                  paginated.map((s, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-4 text-gray-700">{s.sr_no}</td>
                      <td className="px-4 py-4 text-gray-700">{s.student_id}</td>
                      <td className="px-4 py-4 font-medium text-gray-800">{s.s_name}</td>
                      <td className="px-4 py-4 text-gray-700">{s.f_name}</td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${courseColor(s.course)}`}>
                          {s.course}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">₹{s.course_fee}</td>
                      <td className="px-4 py-4 text-gray-700">₹{s.deposit_fee}</td>
                      <td className="px-4 py-4 text-gray-700">{s.mob}</td>
                      <td className="px-4 py-4 text-center">
                        <button className="text-blue-500 hover:text-blue-700 text-lg">
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading && !error && (
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <p className="text-center text-gray-400 py-6 text-sm">No students found..</p>
            ) : (
              paginated.map((s, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">{s.s_name}</h3>
                      <p className="text-xs text-gray-500 mt-1">ID: {s.student_id}</p>
                      <p className="text-xs text-gray-400">Father: {s.f_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${courseColor(s.course)}`}>
                        {s.course}
                      </span>
                      <button className="text-blue-500 text-lg"><FiEye /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                    <FiPhone /> {s.mob}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-xs text-gray-400">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} students
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goTo(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${page === p ? "bg-violet-600 text-white" : "border hover:bg-gray-100 text-gray-700"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}