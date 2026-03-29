"use client";
import { CorrectIcon } from "@/svg/index";
import React, { useState } from "react";

const Checkbox = () => {
  const [show, setShow] = useState(false);
  return (
    <div 
     onClick={()=> setShow(!show)}
     className={`w-4 h-4 border flex cursor-pointer justify-center items-center rounded-sm  ${show ? "bg-white" :"bg-[#ebebeb]"}`}

     >
       {show ? <CorrectIcon/>:""}
    </div>
  );
};

export default Checkbox;
