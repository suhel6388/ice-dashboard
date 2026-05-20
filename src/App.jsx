import React from 'react';
import Dashboard from './pages/Dashboard';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Alter from './pages/Alter'
import Report from './pages/Report'
import Setting from './pages/Setting'
import Profile from './pages/Profile'


import AOS from 'aos';
import 'aos/dist/aos.css'
import HeroSection from './pages/Alter/Landing/Herosection';
import GlassLoginPage from './pages/Alter/Login/Login_page';


const App = () => {

  AOS.init();
  return (
    <div className='w-full h-screen'>
      
     
   <Routes>
    <Route path='/' element = <HeroSection/>/>
     <Route path='/Dashboard/*' element =  <Dashboard/>/>
     <Route path='/Login' element = <GlassLoginPage/> />
   </Routes>
    
       
     


    </div>
  );
}

export default App;
