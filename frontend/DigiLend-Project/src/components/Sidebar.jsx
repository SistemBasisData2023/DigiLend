import React from "react";
import { AiFillDatabase } from "react-icons/ai";
import { FaHandHoldingMedical, FaHandHolding } from "react-icons/fa";
import { IoExit } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div id="sidebar" className="flex flex-col p-6 h-screen sticky top-20">
      <ul className="space-y-5">
        <li className="flex flex-col cursor-pointer rounded-3xl p-1 py-4 w-20 h-28 items-center justify-center hover:bg-info bg-[#303450] hover:text-base-100 text-info border-base-100 border-2 shadow-2xl hover:shadow-inner hover:shadow-black">
          <div className="flex flex-col w-1/2 items-center px-2">
            <AiFillDatabase className="text-3xl" />
            <span className="font-Montserrat font-semibold text-center -space-y-2 text-sm">
              <p>ITEMS</p> <p>LIST</p>
            </span>
          </div>
        </li>
        <li className="flex flex-col cursor-pointer rounded-3xl p-1 py-4 w-20 h-28 items-center justify-center hover:bg-info bg-[#303450] hover:text-base-100 text-info border-base-100 border-2 shadow-2xl hover:shadow-inner hover:shadow-black">
          <div className="flex flex-col w-1/2 items-center px-2">
            <FaHandHoldingMedical className="text-3xl" />
            <span className="font-Montserrat font-semibold text-center text-sm">
              <p>BORROW</p>
            </span>
          </div>
        </li>
        <li className="flex flex-col cursor-pointer rounded-3xl p-1 py-4 w-20 h-28 items-center justify-center hover:bg-info bg-[#303450] hover:text-base-100 text-info border-base-100 border-2 shadow-2xl hover:shadow-inner hover:shadow-black">
          <div className="flex flex-col w-1/2 items-center px-2">
            <FaHandHolding className="text-3xl" />
            <span className="font-Montserrat font-semibold text-center text-sm">
              <p>RETURN</p>
            </span>
          </div>
        </li>
      </ul>
      <div className="flex flex-col cursor-pointer rounded-3xl p-1 py-4 w-20 h-20 items-center justify-center hover:bg-info bg-[#303450] hover:text-base-100 text-info border-base-100 border-2 shadow-2xl hover:shadow-inner hover:shadow-black mt-auto">
        <IoExit className="text-3xl" />
      </div>
    </div>
  );
};

export default Sidebar;
