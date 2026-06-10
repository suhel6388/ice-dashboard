import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiFilter, FiSearch, FiDownload, FiMoreHorizontal,
  FiChevronLeft, FiChevronRight, FiX, FiEye, FiEdit2, FiMessageSquare, FiTrash2
} from "react-icons/fi";
import { supabase_client } from "../../utils/supabaseClient";
import toast from "react-hot-toast";

/* ── Constants ── */
const AVATAR_COLORS = [
  "bg-blue-200 text-blue-700",    "bg-pink-200 text-pink-700",
  "bg-green-200 text-green-700",  "bg-yellow-200 text-yellow-700",
  "bg-purple-200 text-purple-700","bg-rose-200 text-rose-700",
  "bg-teal-200 text-teal-700",    "bg-orange-200 text-orange-700",
];
const STATUSES      = ["All", "Current Due", "Overdue"];
const OVERDUE_OPTS  = ["All", "0", "1", "2", "3", "4+"];
const ROWS_PER_PAGE = 8;
const EMPTY_FILTERS = { status: "All", overdue: "All" };

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

function Avatar({ name = "", index = 0 }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Paid:          "bg-green-100 text-green-600",
    Overdue:       "bg-red-100 text-red-600",
    "Current Due": "bg-orange-100 text-orange-600",
    Upcoming:      "bg-blue-100 text-blue-600",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] ?? styles.Upcoming}`}>
      {status}
    </span>
  );
}

function FilterPanel({ filters, onApply, onClose }) {
  const [local, setLocal] = useState({ ...filters });
  const set = (key, val) => setLocal(p => ({ ...p, [key]: val }));

  return (
    <div className="absolute right-0 top-12 z-50 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Filter Options</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={16} /></button>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => (
            <button key={s} onClick={() => set("status", s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${local.status === s ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Months Overdue</p>
        <div className="flex flex-wrap gap-1.5">
          {OVERDUE_OPTS.map(o => (
            <button key={o} onClick={() => set("overdue", o)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${local.overdue === o ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { onApply(local); onClose(); }}
          className="flex-1 py-2 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition">
          Apply
        </button>
        <button onClick={() => { onApply(EMPTY_FILTERS); onClose(); }}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
          Reset
        </button>
      </div>
    </div>
  );
}

function ActionMenu({ student, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handle = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
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
    <div ref={ref} className="absolute right-8 top-0 z-50 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
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

/* ── Stat Summary Cards ── */
function SummaryCards({ students }) {
  const totalDue      = students.reduce((s, r) => s + r.due, 0);
  const overdueCount  = students.filter(r => r.status === "Overdue").length;
  const currentCount  = students.filter(r => r.status === "Current Due").length;
  const overdueDue    = students.filter(r => r.status === "Overdue").reduce((s, r) => s + r.due, 0);

  const cards = [
    { label: "Total Due",      value: `₹ ${totalDue.toLocaleString("en-IN")}`, color: "text-red-500",    bg: "bg-red-50"    },
    { label: "Overdue",        value: overdueCount,                             color: "text-red-600",   bg: "bg-red-50"    },
    { label: "Current Due",    value: currentCount,                             color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Overdue Amount", value: `₹ ${overdueDue.toLocaleString("en-IN")}`, color: "text-rose-600", bg: "bg-rose-50"   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {cards.map(c => (
        <div key={c.label} className={`rounded-xl p-4 ${c.bg} border border-gray-100`}>
          <p className="text-xs text-gray-500 mb-1">{c.label}</p>
          <p className={`text-lg font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DueInstallments() {
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [page,       setPage]       = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [openMenu,   setOpenMenu]   = useState(null);
  const [filters,    setFilters]    = useState({ ...EMPTY_FILTERS });

  const filterRef = useRef(null);

  /* ── Fetch: only from installments table ── */
  const fetchInstallments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase_client
        .from("installments")
        .select("sr_no, student_id, s_name, installment_no, due_date, amount, paid_amount")
        .order("due_date", { ascending: true });

      if (error) { toast.error(error.message); return; }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formatted = (data ?? [])
        .map(item => {
          const dueDate   = new Date(item.due_date);
          const instAmt   = Number(item.amount)      || 0;
          // paid_amount can be null, undefined, or the number 0 — treat all non-numeric as 0
          const paidAmt   = item.paid_amount !== null && item.paid_amount !== undefined
                              ? Number(item.paid_amount)
                              : 0;
          const dueAmt    = instAmt - paidAmt;

          let status = "Upcoming";
          // Only mark Paid if installment amount > 0 AND fully paid
          if (instAmt > 0 && dueAmt <= 0) {
            status = "Paid";
          } else if (dueDate < today) {
            status = "Overdue";
          } else {
            status = "Current Due";
          }

          const monthsOverdue =
            status === "Overdue"
              ? Math.max(0,
                  (today.getFullYear() - dueDate.getFullYear()) * 12 +
                  (today.getMonth() - dueDate.getMonth()))
              : 0;

          // s_name DB default is the number 40 — always coerce to string
          const rawName = item.s_name;
          const name    = rawName && typeof rawName !== "number" ? String(rawName).trim() : "";

          return {
            // Composite PK: use both sr_no + student_id to guarantee uniqueness
            id:             `${item.sr_no}_${item.student_id}`,
            sid:            item.student_id,
            name,
            dueMonth:       dueDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
            dueDate:        item.due_date,
            installment:    instAmt,
            paid:           paidAmt,
            due:            dueAmt,
            monthsOverdue,
            status,
            installment_no: item.installment_no,
          };
        })
        // Only show unpaid rows (Current Due + Overdue)
        .filter(r => r.status === "Current Due" || r.status === "Overdue");

      setStudents(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInstallments(); }, [fetchInstallments]);

  /* ── Close filter on outside click ── */
  useEffect(() => {
    const handle = e => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const applyFilters = useCallback(f => { setFilters(f); setPage(1); }, []);

  /* ── Filtering ── */
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch  = s.name.toLowerCase().includes(q) || s.sid.toLowerCase().includes(q);
    const matchStatus  = filters.status  === "All" || s.status === filters.status;
    const matchOverdue =
      filters.overdue === "All" ||
      (filters.overdue === "4+" ? s.monthsOverdue >= 4 : s.monthsOverdue === Number(filters.overdue));
    return matchSearch && matchStatus && matchOverdue;
  });

  /* ── Pagination ── */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated   = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const goTo        = n => setPage(Math.max(1, Math.min(n, totalPages)));

  const pageNums = (() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  })();

  const activeFilterCount = Object.values(filters).filter(v => v !== "All").length;

  /* ── CSV Export ── */
  const handleDownload = () => {
    const headers = ["#","Student ID","Student Name","Due Month","Due Date","Installment","Paid","Due","Months Overdue","Status"];
    const rows = filtered.map((s, i) => [
      i + 1, s.sid, s.name, s.dueMonth, s.dueDate,
      s.installment, s.paid, s.due, s.monthsOverdue, s.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "due_installments.csv";
    a.click();
  };

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="p-3 sm:p-6 font-sans">

        {/* Summary Cards */}
        {!loading && <SummaryCards students={students} />}

        {/* Loading */}
        {loading && (
          <div className="p-10 text-center text-gray-400 text-sm">
            <div className="inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading installments…</p>
          </div>
        )}

        {/* Table card */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">
                Due Installments
                <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length} records)</span>
              </h2>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Filter */}
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilter(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition ${
                      showFilter || activeFilterCount > 0
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-blue-500 text-blue-500 hover:bg-blue-50"
                    }`}
                  >
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
                      onApply={applyFilters}
                      onClose={() => setShowFilter(false)}
                    />
                  )}
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search name or ID…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition flex-shrink-0"
                  title="Export CSV"
                >
                  <FiDownload size={16} />
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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
                    {["#","Student ID","Student Name","Due Month","Due Date","Installment","Paid","Due Amount","Months Overdue","Status","Action"].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-gray-400 text-sm">No records found</td>
                    </tr>
                  ) : (
                    paginated.map((s, i) => {
                      const rowIdx = (currentPage - 1) * ROWS_PER_PAGE + i;
                      return (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="py-3 px-3 text-gray-400 text-xs">{rowIdx + 1}</td>
                          <td className="py-3 px-3 text-gray-700 font-medium">{s.sid}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={s.name} index={rowIdx} />
                              <span className="text-gray-800 font-medium whitespace-nowrap">{s.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`font-semibold text-sm ${s.status === "Current Due" ? "text-orange-500" : "text-red-500"}`}>
                              {s.dueMonth}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-600 whitespace-nowrap">{s.dueDate}</td>
                          <td className="py-3 px-3 text-gray-700">₹ {s.installment.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-gray-700">₹ {s.paid.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 font-semibold text-red-500">₹ {s.due.toLocaleString("en-IN")}</td>
                          <td className="py-3 px-3 text-gray-600 text-center">{s.monthsOverdue}</td>
                          <td className="py-3 px-3"><StatusBadge status={s.status} /></td>
                          <td className="py-3 px-3 relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition"
                            >
                              <FiMoreHorizontal size={16} />
                            </button>
                            {openMenu === s.id && (
                              <ActionMenu student={s} onClose={() => setOpenMenu(null)} />
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-3">
              {paginated.length === 0 ? (
                <p className="py-8 text-center text-gray-400 text-sm">No records found</p>
              ) : (
                paginated.map((s, i) => {
                  const rowIdx = (currentPage - 1) * ROWS_PER_PAGE + i;
                  return (
                    <div key={s.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} index={rowIdx} />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.sid}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <StatusBadge status={s.status} />
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}
                              className="p-1.5 hover:bg-white rounded-lg text-gray-500 transition"
                            >
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
                          <p className={`font-semibold ${s.status === "Current Due" ? "text-orange-500" : "text-red-500"}`}>
                            {s.dueMonth}
                          </p>
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
                  );
                })
              )}
            </div>

            {/* ── Pagination Footer ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                  <FiChevronLeft size={14} />
                </button>
                {pageNums.map(n => (
                  <button key={n} onClick={() => goTo(n)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${currentPage === n ? "bg-blue-500 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition">
                  <FiChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}