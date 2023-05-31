import React from "react";
import { useNavigate } from "react-router-dom";
import digilendLogo from "../assets/logo-no-background.png";
import homeImage from "../assets/home-image.png";
import { FaArrowCircleDown, FaClipboardList } from "react-icons/fa";
import { TextAnimation } from "../components/animation/TextAnimation";

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
            <h1 className="md:text-8xl text-6xl font-extrabold font-Montserrat">Welcome to</h1>
            <TextAnimation word="Digilend!" />
          </div>
          <div>
            <p className="md:w-2/3 text-lg">
              Digilend is a user-friendly website catering to Practician and Lab Assistant. Easily register and login to explore our inventory of available items. Practician can request and return items, with a maximum borrowing period of
              one month.Experience the convenience of Digilend for seamless borrowing and returning processes.
            </p>
          </div>
          <div className="space-x-8 flex flex-row">
            <button className="button btn btn-accent md:w-48 md:h-14 rounded-3xl md:text-xl gap-2" onClick={handleLoginClick}>
              <FaArrowCircleDown className="text-2xl" />
              Login
            </button>
            <button className="button btn btn-accent md:w-48 md:h-14 rounded-3xl md:text-xl gap-2" onClick={handleRegisterClick}>
              <FaClipboardList className="text-2xl" />
              Register
            </button>
          </div>
        </div>
        <img src={homeImage} alt="Home" className="my-auto" />
      </div>
    </div>
  );
};

export default MainPage;
