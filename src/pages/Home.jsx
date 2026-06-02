import React,{useState,useEffect} from "react";
import Button from '../components/Button';
import { PiHandDepositDuotone, PiSailboat, PiStudent } from 'react-icons/pi';
import { FaMoneyBill } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { BiEditAlt, BiSolidInstitution } from 'react-icons/bi';
import { BiAnalyse } from 'react-icons/bi';
import Barchart from '../charts/Barchart';
import { FiFilter } from 'react-icons/fi';
import { useRef } from 'react';
import { PiStudentDuotone } from "react-icons/pi";
import FeesAdd from "../components/Fees_Add";
import Addstudent from "../components/Addstudent";
import Carddashboard from "../components/Carddashboard";
import { SiDepositphotos } from "react-icons/si";
import { PiHandDepositBold} from "react-icons/pi";
import { IoArrowBackCircle } from "react-icons/io5";
import {useNavigate } from "react-router-dom";
import ChartHome from "../charts/Home Chart/Chart_home";
import Piechart from "../charts/Piechart";
import LabelPieChart from "../charts/Pie_withLabel";
import DonutChart from "../charts/Donutchart";
import { supabase_client } from "../utils/supabaseClient";
import LoadingSpinner from "../components/Loadingspiner";


const Home = () => {
   
    const [open, setOpen] = useState(0);
    const navigate = useNavigate()
    const [chartdata, setChartdata] = useState([]);
    const [loading, setLoading] = useState(true);
  const [totaldeposit, setTotaldeposit] = useState();
  const [weekly, setWeekly] = useState();
  const [today, setToday] = useState();
    
    useEffect(() => {
      
   fetchData()
   fetchMonthData()
   fetchWeeklyDeposit()
fetchTodayDeposit()
 
    }, []);
    const fetchMonthData = async () => {

  const today = new Date();

  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const { data, error } = await supabase_client
    .from("register_students")
    .select("*")
    .gte("add_date", lastMonth.toISOString());

  if (error) {
    console.log(error);
  } else {

    // Total Course Fee
    const totalCourseFee = data.reduce(
      (sum, student) => sum + Number(student.course_fee || 0),
      0
    );

    // Total Deposit Fee
    const totalDepositFee = data.reduce(
      (sum, student) => sum + Number(student.deposit_fee || 0),
      0
    );
    setTotaldeposit(totalDepositFee)

    // Total Due Fee
    const totalDueFee = data.reduce(
      (sum, student) => sum + Number(student.due_fee || 0),
      0
    );

    console.log("Total Course Fee:", totalCourseFee);

    console.log("Total Deposit Fee:", totalDepositFee);

    console.log("Total Due Fee:", totalDueFee);
  }
};

const fetchWeeklyDeposit = async () => {

  // Last 7 Days Date
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  // Fetch Data
  const { data, error } = await supabase_client
    .from("register_students")
    .select("deposit_fee")
    .gte("add_date", lastWeek.toISOString());

  if (error) {
    console.log(error);
    return;
  }

  // Total Weekly Deposit
  const weeklyDeposit = data.reduce(
    (sum, item) => sum + Number(item.deposit_fee || 0),
    0
  );

  setWeekly(weeklyDeposit)

  console.log("Weekly Deposit:", weeklyDeposit);
};
const fetchTodayDeposit = async () => {

  // Today's Start Time
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch Today's Data
  const { data, error } = await supabase_client
    .from("register_students")
    .select("deposit_fee")
    .gte("add_date", today.toISOString());

  if (error) {
    console.log(error);
    return;
  }

  // Total Today's Deposit
  const todayDeposit = data.reduce(
    (sum, item) => sum + Number(item.deposit_fee || 0),
    0
  );
  setToday(todayDeposit)

  console.log("Today Deposit:", todayDeposit);

  // Optional State
  // setTodayDeposit(todayDeposit);
};


    const fetchData = async () =>{
      setLoading(true)
     const { data, error } = await supabase_client
     .from("register_students")
     .select("s_name, deposit_fee")
     setChartdata(data)
     setLoading(false)


    }

    
    
    const selectRef = useRef()
      const options = [
    { label: "Today Report", value: "today" },
    { label: "1 Week Report", value: "week" },
    { label: "1 Month Report", value: "month1" },
    { label: "2 Month Report", value: "month2" },
    { label: "4 Month Report", value: "month4" },
    { label: "6 Month Report", value: "month6" },
  ];

    return (
      <div className="w-full h-screen fixed overflow-y-auto p-5" >
  <div
    className={`w-full min-h-screen grid 
    ${open === 1 && 2 ? "bg-white/0 backdrop-blur-3xl" : "bg-none"}
    gap-4 text-xl grid-cols-1 place-content-start place-items-center
    text-black font-semibold relative 
    
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-gray-400
    scrollbar-track-transparent
    
    px-4 py-16`}
  >
    
    {/* Header */}
    <div className="flex justify-between items-center absolute top-2 right-1 w-full px-40">
      <p className="text-sm sm:text-lg md:text-xl text-gray-500">
        Home /
        <span className="text-emerald-500 ml-1">
          Dashboard
        </span>
      </p>
    </div>
{loading === true &&(
  <LoadingSpinner/>
)}
    {/* Cards */}
    <div
      className="grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-4 sm:gap-6 
      w-full max-w-7xl"
    >
      <Carddashboard
        title={"Monthly Deposit "}
        amount_value={totaldeposit}
        icon={<SiDepositphotos />}
        
      />

      <Carddashboard
        title={"Weekly Deposit "}
        amount_value={weekly}
        icon={<SiDepositphotos />}
      />

      <Carddashboard
        title={"Today Deposit "}
        amount_value={today}
        icon={<PiStudentDuotone />}
      />

      <Carddashboard
        title={"Admision Monthly "}
        amount_value={" 5,000"}
        icon={<PiStudentDuotone />}
      />

      <Carddashboard
        title={"Admision Yearly "}
        amount_value={" 5,000"}
        icon={<PiStudentDuotone />}
      />

      <Carddashboard
        title={"Total Centre "}
        amount_value={" 2"}
        icon={<BiSolidInstitution />}
      />
    </div>

    {/* Charts */}
    <div className="chart-section mt-6 sm:mt-10 w-full  2">
      <div
        className="grid grid-rows-1 
        grid-cols-1
        xl:grid-cols-2
        justify-center 
        items-center 
        gap-6 
        w-full"
      >
        <div className="w-full h-full overflow-x-auto flex justify-center">
          <Barchart data_is={chartdata} Xdata="s_name" barData="deposit_fee" width={700} height={250} />
        </div>

       

        
         <div className="w-full flex justify-center">
          <Piechart data_is={chartdata} data_key="deposit_fee" name_key="s_name" />
        </div>

        <div className="w-full flex justify-center">
          <LabelPieChart data_is={chartdata} data_key={"deposit_fee"}  />
        </div>

          <div className="w-full flex justify-center">
          <DonutChart data_is={chartdata} data_Key="deposit_fee" name_Key="s_name" />
        </div>
      </div>
    </div>
  </div>
</div>
    );
}

export default Home;
