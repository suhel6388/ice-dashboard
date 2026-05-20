import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate()
  return (

    <div className="min-h-screen w-full bg-gradient-to-br from-[#06134d] via-[#120c73] to-[#0b1f6f] overflow-hidden relative text-white">

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 blur-3xl rounded-full" />

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-5 sm:px-8 md:px-16 py-5 md:py-8 relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold tracking-wide">

          <div className="w-4 h-4 bg-white rotate-45 rounded-sm" />

          <span data-aos="fade-up" data-aos-duration="500">ICE Computer</span>
        </div>

        {/* Menu */}
        <ul className="hidden lg:flex items-center gap-10 xl:gap-16 text-[15px] xl:text-[17px] font-medium text-gray-200">

          <li data-aos="fade-up" data-aos-duration="600">Home</li>
          <li data-aos="fade-up" data-aos-duration="700">Courses</li>
          <li data-aos="fade-up" data-aos-duration="800">Features</li>
          <li data-aos="fade-up" data-aos-duration="900">Location</li>
          <li data-aos="fade-up" data-aos-duration="1000">FAQ</li>
          <li data-aos="fade-up" data-aos-duration="1200">About</li>

        </ul>

        {/* Button */}
        <button
        data-aos="fade-up" data-aos-duration="1400"
        onClick={() => navigate('/login')}
         className="bg-sky-500 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-lg">
          Login
        </button>

      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-16 sm:pt-20 md:pt-28 pb-20">

        <div
         data-aos="fade-up" data-aos-duration="2100"
         className="border border-yellow-400/40 text-yellow-400 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base tracking-wide font-semibold mb-8 sm:mb-10 backdrop-blur-sm">
          Join The Best Computer Institute Today
        </div>

        <h1
         data-aos="fade-up" data-aos-duration="1700"
         className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight md:leading-[80px] lg:leading-[90px] tracking-tight">

          Manage your institute
          <br />
          easily with ICE Computer

        </h1>

        <p
         data-aos="fade-up" data-aos-duration="1800"
         className="max-w-2xl text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mt-6 sm:mt-8 leading-relaxed">

          ICE Computer is a smart school and institute management
          solution that provides a personalized dashboard for every
          student, teacher and admin.

        </p>

        <button onClick={()=> navigate('/login')} 
         data-aos="fade-up" data-aos-duration="1900"
        className="mt-8 sm:mt-10 bg-sky-500 px-7 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg md:text-xl font-semibold">
          Get Started
        </button>

      </section>

      {/* Decorative Shapes */}
      <div className="hidden md:block absolute top-[42%] right-[20%] w-24 h-24 border-[8px] border-yellow-400 rounded-full border-l-transparent rotate-45 opacity-90" />

      <div className="hidden md:block absolute bottom-[20%] left-[22%] w-16 h-16 border-[7px] border-yellow-400 rounded-full border-l-transparent rotate-45 opacity-90" />

    </div>
  );
}