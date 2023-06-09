import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ItemList from "./sub_pages/ItemList.jsx";
import Return from "./sub_pages/Return.jsx";
import Borrow from "./sub_pages/Borrow.jsx";
import EditProfile from "./sub_pages/EditProfile.jsx";
import Group from "./sub_pages/Group.jsx";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("akun"));
  const location = useLocation();
  const currentPath = location.pathname.replace("/dashboard", "");
  return (
    <div id="dashboardPage">
      <Navbar />
      <div className="flex flex-row h-full">
        <Sidebar />
        {location.pathname === "/dashboard" && <ItemList />}
        {currentPath === "/item-list" && <ItemList />}
        {currentPath === "/borrow" && <Borrow />}
        {currentPath === "/return" && <Return />}
        {currentPath === "/profile" && <EditProfile />}
        {currentPath === "/group" && userData.id_role === 1 && <Group />}
        {/* {currentPath !== "/item-list" && currentPath !== "/borrow" && currentPath !== "/return" && currentPath !== "/profile" && currentPath !== "/group" && <Redirect to="/error" />} */}
      </div>
    </div>
  );
};

export default Dashboard;
