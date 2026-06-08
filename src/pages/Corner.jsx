import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CgCalendarDue } from "react-icons/cg";

import {
  UserPlus,
  Wallet,
  Pencil,
  Receipt,
  Upload,
  FileText,
  DollarSign,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import Card from "../components/Corner card/Card";

import FeesAdd from "../components/Fees_Add";



import Addstudent from '../components/Addstudent';
import AddExpense from "./Quick Actions/AddExpense";

import UploadResult from './Viewresult';
import Studentview from './Quick Actions/Student_view';
import DueInstallments from "./Quick Actions/DueInstallments";
import ExpenseDashboard from "./Quick Actions/View_Expense";

const QuickActions = () => {
  const [isopen, setIsopen] = useState(0);

  const navigate = useNavigate()
  const actions = [
  {
    title: "Register Student",
    desc: "Add new student",
    icon: <UserPlus size={22} />,
    bg: "bg-blue-100 text-blue-600",
    
  },
  {
    title: "Deposit Fee",
    desc: "Collect student fee",
    icon: <Wallet size={22} />,
    bg: "bg-green-100 text-green-600",
    
  },
  {
    title: "Alter Student",
    desc: "Update student details",
    icon: <Pencil size={22} />,
    bg: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Add Expense",
    desc: "Record new expense",
    icon: <Receipt size={22} />,
    bg: "bg-red-100 text-red-600",
  },
  {
    title: "Upload Result",
    desc: "Upload exam results",
    icon: <Upload size={22} />,
    bg: "bg-purple-100 text-purple-600",
  },
  {
    title: "View Students",
    desc: "View all students",
    icon: <FileText size={22} />,
    bg: "bg-blue-100 text-blue-600",
  },
  {
    title: "View Fee Records",
    desc: "View fee transactions",
    icon: <DollarSign size={22} />,
    bg: "bg-green-100 text-green-600",
  },
  {
    title: "View Expenses",
    desc: "View all expenses",
    icon: <Receipt size={22} />,
    bg: "bg-orange-100 text-orange-600",
  },
  {
    title: "Reports",
    desc: "Generate reports",
    icon: <BarChart3 size={22} />,
    bg: "bg-purple-100 text-purple-600",
  },
  {
    title: "Due  installment",
    desc: "View due installment",
    icon: <CgCalendarDue size={22} />,
    bg: "bg-teal-100 text-teal-600",
  },
];

  
  return (
    <div className="bg-gray-50 min-h-screen p-6 px-10">
            <Routes>
                    <Route path="add-expense" element={<AddExpense />} />
                       <Route path="view_student" element={<Studentview />} />
                        <Route path="add_result" element={<UploadResult />} />
                             <Route path="due_mstallments" element={<DueInstallments/>} />
                             <Route path="view_expense" element={<ExpenseDashboard/>} />
            </Routes>
       <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

      <div  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 bg-white border-[#FFA500] h-50 shadow-md rounded-md px-5 py-10">
       
      <Card onClick={()=> setIsopen('register')} icon={actions[0].icon} icon_bg={actions[0].bg} title={actions[0].title} desc={actions[0].desc}  />
      
                    {/* add fee  */}
                    <Card onClick={() => setIsopen('fee_add')} icon={actions[1].icon} icon_bg={actions[1].bg} title={actions[1].title} desc={actions[1].desc} />
                     {/* ALTER fee  */}
                    <Card icon={actions[2].icon} icon_bg={actions[2].bg} title={actions[2].title} desc={actions[2].desc} onClick={()=> navigate("/Dashboard/alter")} />
            
<Card icon={actions[3].icon} icon_bg={actions[3].bg} title={actions[3].title} desc={actions[3].desc} onClick={()=> navigate("add-expense")} />
<Card icon={actions[4].icon} icon_bg={actions[4].bg} title={actions[4].title} desc={actions[4].desc} onClick={()=> navigate("add_result")} />
<Card icon={actions[5].icon} icon_bg={actions[5].bg} title={actions[5].title} desc={actions[5].desc} onClick={()=> navigate("view_student")} />
<Card icon={actions[6].icon} icon_bg={actions[6].bg} title={actions[6].title} desc={actions[6].desc}  />
<Card icon={actions[7].icon} icon_bg={actions[7].bg} title={actions[7].title} desc={actions[7].desc} onClick={()=> navigate("view_expense")}/>
<Card icon={actions[8].icon} icon_bg={actions[8].bg} title={actions[8].title} desc={actions[8].desc} />
<Card icon={actions[9].icon} icon_bg={actions[9].bg} title={actions[9].title} desc={actions[9].desc} onClick={()=> navigate("due_mstallments")} />

      </div>
     
   
       {isopen === 'register' &&(
                        <Addstudent close={()=> setIsopen('')} />
                    )}
      {isopen === 'fee_add' &&(
                        <FeesAdd close={()=> setIsopen('')} />
                    )}




                   
    </div>
  );
};

export default QuickActions;