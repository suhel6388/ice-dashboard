import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loaderspin = () => {
    return (
        <div className='absolute right-10 '>
      <AiOutlineLoading3Quarters  color='white'  className=" animate-spin text-white " size={40} />
    </div>
    );
}

export default Loaderspin;
