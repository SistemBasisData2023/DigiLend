import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageNotFound from "../assets/page-not-found.svg";

const ErrorPage = () => {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
  }
  return (
    <motion.div
      className="w-full h-screen flex flex-row justify-center items-center gap-24"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}>
      <img src={PageNotFound} alt="Page Not Found" className="h-2/3" />
      <div className="font-Montserrat space-y-10 w-1/4">
        <div className="text-7xl font-semibold">Oops...</div>
        <div className="text-9xl text-accent font-black">404</div>
        <div className="text-2xl">It seems you've taken a wrong turn and ended up in the land of lost webpages.</div>

        <motion.button className="btn btn-error text-xl" onClick={handleClick} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          Home
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ErrorPage;
