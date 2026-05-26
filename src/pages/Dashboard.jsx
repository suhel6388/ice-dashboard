import React,{useState} from 'react';
import Sidebar from '../components/Sidebar';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import ConfirmCard from '../components/Confirmcaards';
import { supabase_client } from "../utils/supabaseClient";

  
const Dashboard = () => {
    const navigate = useNavigate()
      const [promise, setPromise] = useState(false);
       // Logout Function
  const Signout = async () => {
    const { error } = await supabase_client.auth.signOut();

    if (error) {
      console.log(error.message);
    } else {
      navigate("/");
    }
  };
 



    
    return (
        <div className='flex flex-row w-full  h-fit justify-center item-center  fixed z-0 inset-0 bg-white'>
            {promise === true && (
                <ConfirmCard
                  onYes={Signout}
                  onNo={() => setPromise(false)}
                />
            )}
            <Sidebar setPromise={setPromise}/>
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
