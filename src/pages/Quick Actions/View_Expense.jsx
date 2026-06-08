import { useEffect, useMemo, useState } from "react";
import { supabase_client } from "../../utils/supabaseClient";
import { useNavigate,Link} from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import { FaPlus } from "react-icons/fa";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#EAB308",
];

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const  navigate = useNavigate()

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    getExpenses();
  }, []);

  async function getExpenses() {
    setLoading(true);

    const { data, error } = await supabase_client
      .from("add_expenses")
      .select("*")
      .order("date", { ascending: false });

    if (!error) {
      setExpenses(data || []);
    }

    setLoading(false);
  }

  const categories = [
    ...new Set(expenses.map((item) => item.category)),
  ];

  const filteredData = useMemo(() => {
    return expenses.filter((item) => {
      const month =
        new Date(item.date).getMonth() + 1;

      const monthMatch =
        selectedMonth === "all"
          ? true
          : Number(selectedMonth) === month;

      const categoryMatch =
        selectedCategory === "all"
          ? true
          : item.category === selectedCategory;

      return monthMatch && categoryMatch;
    });
  }, [
    expenses,
    selectedMonth,
    selectedCategory,
  ]);

  const totalExpense = filteredData.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const totalTransactions =
    filteredData.length;

  const avgExpense =
    totalTransactions > 0
      ? Math.round(
          totalExpense / totalTransactions
        )
      : 0;

  const categoryTotals = {};

  filteredData.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) +
      item.amount;
  });

  const topCategory =
    Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "-";

  const pieData = Object.entries(
    categoryTotals
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const monthlyMap = {};

  filteredData.forEach((item) => {
    const month = new Date(
      item.date
    ).toLocaleString("default", {
      month: "short",
    });

    monthlyMap[month] =
      (monthlyMap[month] || 0) +
      item.amount;
  });

  const monthlyData = Object.entries(
    monthlyMap
  ).map(([month, amount]) => ({
    month,
    amount,
  }));

  const totalPages = Math.ceil(
    filteredData.length / pageSize
  );

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="min-h-screen h-screen bg-slate-50 p-4 md:p-6 overflow-y-auto overflow-x-auto">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Expense Tracker
            </h1>

            <p className="text-slate-500">
              Expense Overview
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="h-11 px-4 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">
                All Months
              </option>

              {Array.from(
                { length: 12 },
                (_, i) => (
                  <option
                    key={i}
                    value={i + 1}
                  >
                    Month {i + 1}
                  </option>
                )
              )}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="h-11 px-4 rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          <Card
            title="Total Expenses"
            value={`₹${totalExpense.toLocaleString()}`}
          />

          <Card
            title="Transactions"
            value={totalTransactions}
          />

          <Card
            title="Average Expense"
            value={`₹${avgExpense.toLocaleString()}`}
          />

          <Card
            title="Top Category"
            value={topCategory}
          />

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">

            <h2 className="font-semibold text-lg mb-4">
              Expense By Category
            </h2>

            <div className="h-[350px]">

              <ResponsiveContainer>
                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    innerRadius={70}
                    label
                  >
                    {pieData.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </div>

          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <h2 className="font-semibold text-lg mb-4">
              Monthly Trend
            </h2>

            <div className="h-[350px]">

              <ResponsiveContainer>
                <BarChart
                  data={monthlyData}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="amount" />
                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Transactions */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-5 flex flex-col sm:flex-row justify-between gap-3">

            <h2 className="text-lg font-semibold">
              Recent Transactions
            </h2>
                     <Link to="/Dashboard/Corner/add-expense">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg" >
           
              <FaPlus />
              Add Expense
            </button>
                </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="bg-slate-100">

                <tr>
                  <th className="text-left p-4">
                    Title
                  </th>

                  <th className="text-left p-4">
                    Category
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-left p-4">
                    Payment Mode
                  </th>

                  <th className="text-left p-4">
                    Description
                  </th>

                  <th className="text-right p-4">
                    Amount
                  </th>
                </tr>

              </thead>

              <tbody>

                {paginatedData.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">
                        {item.title}
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {
                            item.category
                          }
                        </span>
                      </td>

                      <td className="p-4">
                        {item.date}
                      </td>

                      <td className="p-4">
                        {
                          item.paymentMode
                        }
                      </td>

                      <td className="p-4">
                        {
                          item.description
                        }
                      </td>

                      <td className="p-4 text-right font-semibold">
                        ₹{item.amount}
                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}

          <div className="p-4 flex justify-end gap-3">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (prev) => prev - 1
                )
              }
              className="border px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(
                  (prev) => prev + 1
                )
              }
              className="border px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

      <p className="text-slate-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2 text-slate-900">
        {value}
      </h2>

    </div>
  );
}