import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillDatabase } from "react-icons/ai";
import { FaHandHoldingMedical, FaHandHolding } from "react-icons/fa";
import { IoExit } from "react-icons/io5";

const Sidebar = () => {
  const userData = window.userData;
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("");

  const handleClick = (link) => {
    navigate(`/dashboard${link}`, { state: { relative: true } });
    setActivePage(link);
  };
  const handleLogout = () => {
    window.userData = null;
  };
  return (
    <div id="sidebar" className="flex flex-col sm:p-6 h-screen sticky top-20">
      <ul className="space-y-5">
        <motion.li
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          onClick={() => handleClick("/item-list")}
          className="flex flex-col items-center justify-center custom-button p-1 w-20 h-28 cursor-pointer shadow-2xl"
          style={{ "--clr": "#45d2c6" }}>
          <span className="flex flex-col items-center justify-center">
            <AiFillDatabase className="text-3xl" />
            <div className="font-Montserrat font-semibold text-center text-sm">
              <p>ITEM</p> <p>LIST</p>
            </div>
          </span>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          onClick={() => handleClick("/borrow")}
          className="flex flex-col items-center justify-center custom-button p-1 w-20 h-28 cursor-pointer shadow-2xl"
          style={{ "--clr": "#45d2c6" }}>
          <span className="flex flex-col items-center justify-center">
            <FaHandHoldingMedical className="text-3xl" />
            <div className="font-Montserrat font-semibold text-center text-sm">
              <p>BORROW</p>
            </div>
          </span>
        </motion.li>
        <motion.li
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          onClick={() => handleClick("/return")}
          className="flex flex-col items-center justify-center custom-button p-1 w-20 h-28 cursor-pointer shadow-2xl"
          style={{ "--clr": "#45d2c6" }}>
          <span className="flex flex-col items-center justify-center">
            <FaHandHolding className="text-3xl" />
            <div className="font-Montserrat font-semibold text-center text-sm">
              <p>RETURN</p>
            </div>
          </span>
        </motion.li>
      </ul>
      <motion.a
        href="/"
        onClick={handleLogout}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.7,
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
          scale: {
            type: "spring",
            damping: 5,
            stiffness: 100,
            restDelta: 0.001,
          },
        }}
        className="custom-button flex flex-col cursor-pointer rounded-3xl p-1 py-4 w-20 h-20 items-center justify-center shadow-2xl mt-auto"
        style={{ "--clr": "#45d2c6" }}>
        <span>
          <IoExit className="text-3xl" />
        </span>
      </motion.a>
    </div>
  );
};

export default Sidebar;
