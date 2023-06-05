import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AiOutlineSearch } from "react-icons/ai";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const ItemListPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setItems(data);
    console.log(data);
  };

  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const itemlist = document.getElementById("itemlist");
    itemlist.style.width = `calc(99.5vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <div id="dashboardPage">
      <Navbar />
      <div className="flex flex-row h-full">
        <Sidebar />
        <div className="overflow-x-auto">
          <div className="p-2 py-6 flex items-center">
            <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" />
            <AiOutlineSearch className="text-2xl -translate-x-10" />
          </div>
          <table id="itemlist" className="table table-zebra shadow-xl">
            <thead>
              <tr>
                <th></th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((data) => {
                return (
                  <tr key={data.id}>
                    <th></th>
                    <td>{data.id}</td>
                    <td>{data.name}</td>
                    <td>{data.username}</td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle shadow-xl">
                          <IoEllipsisVerticalSharp />
                        </label>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                          <li>
                            <a>Borrow</a>
                          </li>
                          <li>
                            <a>Return</a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemListPage;
