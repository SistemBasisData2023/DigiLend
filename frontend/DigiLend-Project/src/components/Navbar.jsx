import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import digilendLogo from "../assets/logo-no-background.png";

const Navbar = () => {
  const storedData = sessionStorage.getItem("akun");
  const userData = JSON.parse(storedData);
  const navigate = useNavigate();
  const handleClick = (link) => {
    navigate(`/dashboard${link}`, { state: { relative: true } });
  };
  useEffect(() => {
    const navbarHeight = document.getElementById("navbar").offsetHeight;
    const sidebar = document.getElementById("sidebar");
    const dashboardPage = document.getElementById("dashboardPage");
    sidebar.style.height = `calc(100vh - ${navbarHeight}px)`;
    dashboardPage.style.height = `calc(100vh - ${navbarHeight}px)`;
  }, []);

  return (
    <div id="navbar" className="navbar rounded-es-2xl rounded-ee-2xl bg-[#40476C] shadow-2xl sticky top-0">
      <a href="/dashboard" className="flex-1 mx-6 gap-6 items-center cursor-pointer">
        <img src={digilendLogo} alt="Digilend" className="h-16 w-fit" />
        <span className="font-Montserrat text-2xl font-bold">Digilend</span>
      </a>
      <div className="flex-none gap-2 mx-6">
        <label className="btn btn-ghost" onClick={() => handleClick("/edit-profile")}>
          {userData && userData.nama ? userData.nama : "USER"}
        </label>
      </div>
    </div>
  );
};

export default Navbar;
