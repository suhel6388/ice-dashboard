import React,{useState} from 'react';
import { FiSidebar } from "react-icons/fi";
import { MdEdit, MdHomeFilled } from "react-icons/md";
import { TbReportSearch } from 'react-icons/tb';
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home'
import Alter from '../pages/Alter'
import Report from '../pages/Report'
import Setting from '../pages/Setting'
import Profile from '../pages/Profile'
import { LuLogOut } from 'react-icons/lu';
import { PiStudentBold } from "react-icons/pi";




const Sidebar = () => {
    const navigate = useNavigate()
    const [navopen, setNavopen] = useState(true);
    const [active, setActive] = useState("home");
  
    return (
        <div 
    
        
        
        className={`flex flex-col   ${!navopen ? 'w-1/6':`w-16`} h-screen 
         rounded-sm shadow-xl font-bold text-xl gap-14 items-center py-10 text-white cursor-pointer tranformx ring-1 ring-emerald-200`}
         style={{
        background: "#343434",
      }}
         >
       
        <div className='w-full h-22 flex justify-center item-center cursor-pointer' onClick={()=>{
           
            setNavopen(!navopen)
           
           

        }}  > < FiSidebar size={20}
        onClick={()=>{
           
            setNavopen(!navopen)
           
           

        }}
        /></div>
            
            <ul className={`flex flex-col gap-10 text-xl justify-center items-center  font-semibold`}>


                




        
                <li 
                
                onClick={()=>{
                    navigate('/Dashboard/Home')
                    setActive('home')
                }}
                className={`flex justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] ${navopen == true ? "p-2 w-fit "  : "px-5 py-2 gap-2" } rounded 
                
                 ${active === "home" ? "bg-[#303030]" : "bg-none"}
                 `}> 
                <MdHomeFilled/> {!navopen && <span>Home</span>} </li>
                
                   <li 
                 onClick={()=>{
                     navigate('/Dashboard/Corner')
                    setActive('corner')
                }}
                className={`flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded 
                 ${navopen == true ? "p-2 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "corner" ? "bg-[#303030]" : "bg-none"}
                 `}
                ><PiStudentBold/> {!navopen && <span>Student Corner</span>} </li>


                <li 
                onClick={()=>{
                     navigate('/Dashboard/alter')
                    setActive('alter')
                }}
                className={`flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded 
                 ${navopen == true ? "p-2 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "alter" ? "bg-[#303030]" : "bg-none"}
                 `}> 


                <MdEdit/>{!navopen && <span>Alter</span>} </li>

                  <li 
                 onClick={()=>{
                     navigate('/Dashboard/report')
                    setActive('report')
                }}
                className={`flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded 
                 ${navopen == true ? "p-2 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "report" ? "bg-[#303030]" : "bg-none"}
                 `}
                ><TbReportSearch/> {!navopen && <span>Report</span>} </li>


              

                <li  onClick={()=>{
                     navigate('/Dashboard/setting')
                    setActive('setting')
                }}
                className={`flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded 
                 ${navopen == true ? "p-2 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "setting" ? "bg-[#303030]" : "bg-none"}
                 `}> <IoMdSettings /> {!navopen && <span>Setting</span>} </li>
                <li  onClick={()=>{
                    navigate("/Dashboard/profile")
                    setActive('profile')
                }}
                className={`  flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded
                 ${navopen == true ? "p-1 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "profile" ? "bg-[#303030]" : "bg-none"}

                 `}><CgProfile/>{!navopen && <span>Profile</span>} </li>
                  <li  onClick={()=>{
                  
                    setActive('logout')
                }}

                className={`  flex gap-2 justify-center items-center cursor-pointer
                 active:bg-[#303030]  hover:bg-[#303030] px-5 py-2 rounded
                 ${navopen == true ? "p-1 w-fit "  : "px-5 py-2 gap-2" }
                 ${active === "logout" ? "bg-[#303030]" : "bg-none"}
                 `}><LuLogOut/>{!navopen && <span>Logout</span>} </li>                
                 


            </ul>
   
        </div>
    );
}


export default Sidebar;
