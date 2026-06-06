import { FiUsers } from "react-icons/fi";
import { PiCurrencyInrBold } from "react-icons/pi";
import { BsCalendar3 } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";

const cards = [
  {
    icon: <FiUsers size={22} className="text-rose-500" />,
    iconBg: "bg-rose-100",
    label: "Total Students (Due)",
    value: "48",
    sub: "Students with pending payments",
    valueColor: "text-gray-800",
  },
  {
    icon: <PiCurrencyInrBold size={22} className="text-orange-500" />,
    iconBg: "bg-orange-100",
    label: "Total Due Amount",
    value: "₹ 1,25,600",
    sub: "Total outstanding amount",
    valueColor: "text-gray-800",
  },
  {
    icon: <BsCalendar3 size={20} className="text-blue-500" />,
    iconBg: "bg-blue-100",
    label: "Current Month Due",
    value: "₹ 35,200",
    sub: "Due in May 2025",
    valueColor: "text-blue-600",
  },
  {
    icon: <MdOutlineAccessTime size={22} className="text-purple-500" />,
    iconBg: "bg-purple-100",
    label: "Overdue (Past Months)",
    value: "₹ 90,400",
    sub: "From previous months",
    valueColor: "text-purple-600",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4"
        >
          <div className={`${card.iconBg} p-3 rounded-xl flex-shrink-0`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${card.valueColor}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
