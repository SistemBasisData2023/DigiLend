import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleDown, FaClipboardList } from "react-icons/fa";
import digilendLogo from "../assets/logo-no-background.png";
import homeImage from "../assets/home-image.png";
import { TextAnimation } from "../components/animation/TextAnimation.jsx";

const MainPage = () => {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login");
  }

  function handleRegisterClick() {
    navigate("/register");
  }
  return (
    <div className="w-full h-screen">
      <div className="flex md:flex-row flex-col space-y-12 h-screen mx-5 md:mx-10">
        <div className="space-y-9">
          <img src={digilendLogo} alt="Digilend" className="mt-12 md:h-24 h-16 w-fit" />
          <div className="space-y-4">
            <h1 className="md:text-8xl sm:text-6xl text-5xl font-extrabold font-Montserrat">Welcome to</h1>
            <TextAnimation word="Digilend!" />
          </div>
          <div>
            <p className="md:w-2/3 sm:text-lg text-sm">
              Digilend is a user-friendly website catering to Practician and Lab Assistant. Easily register and login to explore our inventory of available items. Practician can request and return items, with a maximum borrowing period of
              one month.Experience the convenience of Digilend for seamless borrowing and returning processes.
            </p>
          </div>
          <div className="space-x-8 flex flex-row">
            <button className="button btn btn-accent md:w-48 md:h-14 rounded-3xl md:text-xl gap-2" onClick={handleLoginClick}>
              <FaArrowCircleDown className="md:text-2xl sm:text-xl text-lg" />
              Login
            </button>
            <button className="button btn btn-accent md:w-48 md:h-14 rounded-3xl md:text-xl gap-2" onClick={handleRegisterClick}>
              <FaClipboardList className="md:text-2xl sm:text-xl text-lg" />
              Register
            </button>
          </div>
        </div>
        <motion.img
          src={homeImage}
          alt="Home"
          className="my-auto h-10/12 w-fit"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        />
      </div>
    </div>
  );
};

export default MainPage;
