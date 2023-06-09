import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ItemList from "./sub_pages/ItemList.jsx";
import Return from "./sub_pages/Return.jsx";
import Borrow from "./sub_pages/Borrow.jsx";
import EditProfile from "./sub_pages/EditProfile.jsx";

const Dashboard = () => {
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
        {currentPath === "/edit-profile" && <EditProfile />}
      </div>
    </div>
  );
};

export default Dashboard;
