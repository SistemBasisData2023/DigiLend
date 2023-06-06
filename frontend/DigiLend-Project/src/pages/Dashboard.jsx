import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ItemList from "../sub_pages/ItemList.jsx";
import Return from "../sub_pages/Return";
import Borrow from "../sub_pages/Borrow";

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
      </div>
    </div>
  );
};

export default Dashboard;
