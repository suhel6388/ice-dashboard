import React from 'react';
import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import Alter from '../pages/Alter'
import Report from '../pages/Report'
import Setting from '../pages/Setting'
import Profile from '../pages/Profile'

import QuickActions from './Corner';
import Addstudent from '../components/Addstudent';
import AddExpense from "./Quick Actions/AddExpense";

import UploadResult from './Viewresult';
import Studentview from './Quick Actions/Student_view';
  
const Dashboard = () => {



    
    return (
        <div className='flex flex-row w-full  h-fit justify-center item-center  fixed z-0 inset-0 bg-white'

        >
            <Sidebar/>
                     <div  className='w-full h-screen flex justify-center'>
                     <Routes>
       
      <Route path="Home" element={<Home />} />

      <Route path="alter" element={<Alter />} />

      <Route path="report" element={<Report />} />

      <Route path="setting" element={<Setting />} />

      <Route path="profile" element={<Profile />} />

      <Route path="Corner/*" element={<QuickActions />} />

   
         

            
      </Routes>
    
            </div>
            
            
        </div>
    );
}

export default Dashboard;
