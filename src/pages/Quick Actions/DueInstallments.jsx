import { useState, useRef, useEffect } from "react";
import {
  FiFilter, FiSearch, FiDownload, FiMoreHorizontal,
  FiChevronLeft, FiChevronRight, FiX, FiEye, FiEdit2, FiMessageSquare, FiTrash2
} from "react-icons/fi";
import StatCards from "../../components/StatCards";

const students = [
  { id: 1, sid: "STU001", name: "Rahul Kumar",  course: "ADCA",        dueMonth: "May 2025", dueDate: "05 May 2025", installment: 3000, paid: 0,    due: 3000, monthsOverdue: 0, status: "Current Due" },
  { id: 2, sid: "STU002", name: "Anjali Singh", course: "DCA",         dueMonth: "Apr 2025", dueDate: "05 Apr 2025", installment: 3000, paid: 0,    due: 3000, monthsOverdue: 1, status: "Overdue" },
  { id: 3, sid: "STU003", name: "Mohit Verma",  course: "Tally Prime", dueMonth: "Mar 2025", dueDate: "05 Mar 2025", installment: 3000, paid: 1000, due: 2000, monthsOverdue: 2, status: "Overdue" },
  { id: 4, sid: "STU004", name: "Priya Sharma", course: "ADCA",        dueMonth: "Feb 2025", dueDate: "05 Feb 2025", installment: 3000, paid: 0,    due: 3000, monthsOverdue: 3, status: "Overdue" },
  { id: 5, sid: "STU005", name: "Vikas Yadav",  course: "DCA",         dueMonth: "May 2025", dueDate: "05 May 2025", installment: 2500, paid: 500,  due: 2000, monthsOverdue: 0, status: "Current Due" },
  { id: 6, sid: "STU006", name: "Neha Gupta",   course: "Tally Prime", dueMonth: "Apr 2025", dueDate: "05 Apr 2025", installment: 2500, paid: 0,    due: 2500, monthsOverdue: 1, status: "Overdue" },
  { id: 7, sid: "STU007", name: "Karan Patel",  course: "ADCA",        dueMonth: "Jan 2025", dueDate: "05 Jan 2025", installment: 3000, paid: 0,    due: 3000, monthsOverdue: 4, status: "Overdue" },
  { id: 8, sid: "STU008", name: "Sneha Raj",    course: "DCA",         dueMonth: "Mar 2025", dueDate: "05 Mar 2025", installment: 2500, paid: 500,  due: 2000, monthsOverdue: 2, status: "Overdue" },
];

const avatarColors = [
  "bg-blue-200 text-blue-700", "bg-pink-200 text-pink-700",  "bg-green-200 text-green-700",
  "bg-yellow-200 text-yellow-700", "bg-purple-200 text-purple-700", "bg-rose-200 text-rose-700",
  "bg-teal-200 text-teal-700", "bg-orange-200 text-orange-700",
];

const COURSES  = ["All", "ADCA", "DCA", "Tally Prime"];
const STATUSES = ["All", "Current Due", "Overdue"];
const OVERDUE  = ["All", "0", "1", "2", "3", "4+"];
const ROWS_PER_PAGE = 8;

/* ── Avatar ── */
function Avatar({ name, index }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[index % avatarColors.length]}`}>
      {initials}
    </div>
  );
}

/* ── StatusBadge ── */
function StatusBadge({ status }) {
  return status === "Current Due"
    ? <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600 border border-orange-200 whitespace-nowrap">{status}</span>
    : <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200 whitespace-nowrap">{status}</span>;
}

/* ── DueMonthBadge ── */
function DueMonthBadge({ month, status }) {
  return (
    <span className={`font-semibold text-sm ${status === "Current Due" ? "text-orange-500" : "text-red-500"}`}>
      {month}
    </span>
  );
}

/* ── Filter Panel ── */
function FilterPanel({ filters, setFilters, onClose }) {
  const [local, setLocal] = useState({ ...filters });
  const set = (key, val) => setLocal(p => ({ ...p, [key]: val }));

  return (
    <div className="absolute right-0 top-12 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-h-[80vh] overflow-y-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Filter Options</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={16} /></button>
      </div>

      {/* Course */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Course</p>
        <div className="flex flex-wrap gap-1.5">
          {COURSES.map(c => (
            <button key={c} onClick={() => set("course", c)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition
                ${local.course === c ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => (
            <button key={s} onClick={() => set("status", s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition
                ${local.status === s ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Months Overdue */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Months Overdue</p>
        <div className="flex flex-wrap gap-1.5">
          {OVERDUE.map(o => (
            <button key={o} onClick={() => set("overdue", o)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition
                ${local.overdue === o ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setFilters(local); onClose(); }}
          className="flex-1 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition">
          Apply
        </button>
        <button
          onClick={() => {
            const empty = { course: "All", status: "All", overdue: "All" };
            setLocal(empty);
            setFilters(empty);
            onClose();
          }}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
          Reset
        </button>
      </div>
    </div>
  );
}

/* ── Action Menu ── */
function ActionMenu({ student, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const actions = [
    { icon: <FiEye size={14} />,          label: "View Details",  color: "text-gray-700"  },
    { icon: <FiEdit2 size={14} />,         label: "Edit Record",   color: "text-blue-600"  },
    { icon: <FiMessageSquare size={14} />, label: "Send Reminder", color: "text-green-600" },
    { icon: <FiTrash2 size={14} />,        label: "Delete",        color: "text-red-500"   },
  ];

  return (
    <div ref={ref}
      className="absolute right-8 top-0 z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
      <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase truncate">{student.name}</p>
      <div className="border-t border-gray-100">
        {actions.map(a => (
          <button key={a.label} onClick={onClose}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition ${a.color}`}>
            {a.icon} {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DueInstallments() {
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);   // ← single source of truth
  const [showFilter, setShowFilter] = useState(false);
  const [openMenu,   setOpenMenu]   = useState(null);
  const [filters,    setFilters]    = useState({ course: "All", status: "All", overdue: "All" });

  const filterRef = useRef(null);

  /* close filter panel on outside click */
  useEffect(() => {
    const handle = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  /* ── filtering ── */
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch  = s.name.toLowerCase().includes(q) || s.sid.toLowerCase().includes(q);
    const matchCourse  = filters.course  === "All" || s.course  === filters.course;
    const matchStatus  = filters.status  === "All" || s.status  === filters.status;
    const matchOverdue = filters.overdue === "All" ||
      (filters.overdue === "4+" ? s.monthsOverdue >= 4 : s.monthsOverdue === Number(filters.overdue));
    return matchSearch && matchCourse && matchStatus && matchOverdue;
  });

  /* ── pagination ──
     clamp current page so it never exceeds new totalPages after filter change */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);          // display-safe value
  const paginated   = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  const goTo = (n) => setPage(Math.max(1, Math.min(n, totalPages)));

  /* sliding window of at most 5 page buttons */
  const pageNums = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages];
    return [currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2];
  })();

  const activeFilterCount = Object.values(filters).filter(v => v !== "All").length;

  /* helper to apply filters + reset page */
  const applyFilters = (f) => { setFilters(f); setPage(1); };

  return (
    /* ── outer scroll container ── */
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="p-3 sm:p-6 font-sans">

        {/* Stat Cards */}
        <StatCards />

        {/* ── Table card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">

          {/* Header row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Due Installments (Month Wise)</h2>

            <div className="flex items-center gap-2 flex-wrap">

              {/* Filter button + panel */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilter(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition
                    ${showFilter || activeFilterCount > 0
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-blue-500 text-blue-500 hover:bg-blue-50"}`}>
                  <FiFilter size={14} />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 bg-white text-blue-600 rounded-full w-4 h-4 text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {showFilter && (
                  <FilterPanel
                    filters={filters}
                    setFilters={applyFilters}
                    onClose={() => setShowFilter(false)}
                  />
                )}
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Download */}
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition flex-shrink-0">
                <FiDownload size={16} />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.course !== "All" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                  Course: {filters.course}
                  <button onClick={() => applyFilters({ ...filters, course: "All" })}><FiX size={10} /></button>
                </span>
              )}
              {filters.status !== "All" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                  Status: {filters.status}
                  <button onClick={() => applyFilters({ ...filters, status: "All" })}><FiX size={10} /></button>
                </span>
              )}
              {filters.overdue !== "All" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-200">
                  Overdue: {filters.overdue} mo
                  <button onClick={() => applyFilters({ ...filters, overdue: "All" })}><FiX size={10} /></button>
                </span>
              )}
            </div>
          )}

          {/* ── Desktop Table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["#","Student ID","Student Name","Course","Due Month","Due Date",
                    "Installment Amount","Paid Amount","Due Amount","Months Overdue","Status","Action"
                  ].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={12} className="py-10 text-center text-gray-400 text-sm">No records found</td></tr>
                ) : paginated.map((s, i) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3 px-3 text-gray-500">{(currentPage - 1) * ROWS_PER_PAGE + i + 1}</td>
                    <td className="py-3 px-3 text-gray-700 font-medium">{s.sid}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={s.name} index={(currentPage-1)*ROWS_PER_PAGE+i} />
                        <span className="text-gray-800 font-medium whitespace-nowrap">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{s.course}</td>
                    <td className="py-3 px-3"><DueMonthBadge month={s.dueMonth} status={s.status} /></td>
                    <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{s.dueDate}</td>
                    <td className="py-3 px-3 text-gray-700">₹ {s.installment.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 text-gray-700">₹ {s.paid.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 font-semibold text-red-500">₹ {s.due.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-3 text-gray-600 text-center">{s.monthsOverdue}</td>
                    <td className="py-3 px-3"><StatusBadge status={s.status} /></td>
                    <td className="py-3 px-3 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                        <FiMoreHorizontal size={16} />
                      </button>
                      {openMenu === s.id && (
                        <ActionMenu student={s} onClose={() => setOpenMenu(null)} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile Cards ── */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <p className="py-8 text-center text-gray-400 text-sm">No records found</p>
            ) : paginated.map((s, i) => (
              <div key={s.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} index={(currentPage-1)*ROWS_PER_PAGE+i} />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.sid} · {s.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={s.status} />
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                        className="p-1.5 hover:bg-white rounded-lg text-gray-500 transition">
                        <FiMoreHorizontal size={16} />
                      </button>
                      {openMenu === s.id && (
                        <ActionMenu student={s} onClose={() => setOpenMenu(null)} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-400">Due Month</p>
                    <DueMonthBadge month={s.dueMonth} status={s.status} />
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-400">Due Date</p>
                    <p className="font-medium text-gray-700">{s.dueDate}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-400">Installment</p>
                    <p className="font-medium text-gray-700">₹ {s.installment.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="text-gray-400">Paid</p>
                    <p className="font-medium text-gray-700">₹ {s.paid.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-gray-400">Due Amount</p>
                      <p className="font-bold text-red-500">₹ {s.due.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400">Months Overdue</p>
                      <p className="font-semibold text-gray-700">{s.monthsOverdue}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination Footer ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length} entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                <FiChevronLeft size={14} />
              </button>

              {pageNums.map(n => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition
                    ${currentPage === n
                      ? "bg-blue-500 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {n}
                </button>
              ))}

              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}