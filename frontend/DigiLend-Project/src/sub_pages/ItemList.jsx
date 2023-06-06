import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import EditItem from "../components/EditItem";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [showEditItem, setShowEditItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setItems(data);
    console.log(data);
  };

  const handleClickEdit = (data) => {
    setSelectedItem(data);
    setShowEditItem((prevState) => !prevState);
  };

  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const itemlist = document.getElementById("itemlist");
    itemlist.style.width = `calc(99.5vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <Fragment>
      <div className="overflow-x-auto">
        <div className="flex flex-col items-center pt-6">
          <h1 className="font-Montserrat font-bold text-5xl text-accent">Item List</h1>
        </div>
        <div className="p-6 flex items-center">
          <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" />
          <AiOutlineSearch className="text-2xl -translate-x-10" />
        </div>
        <table id="itemlist" className="table table-zebra shadow-xl">
          <thead>
            <tr className="text-white">
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
                <tr key={data.id} className="text-white">
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.name}</td>
                  <td>{data.username}</td>
                  <td>
                    <button className="btn btn-ghost btn-circle shadow-xl" onClick={() => handleClickEdit(data)}>
                      <IoEllipsisVerticalSharp />
                    </button>

                    {/* <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle shadow-xl">
                        <IoEllipsisVerticalSharp />
                      </label>
                      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                          <a href="/dashboard/borrow">Borrow</a>
                        </li>
                        <li>
                          <a href="/dashboard/return">Return</a>
                        </li>
                      </ul>
                    </div> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <EditItem isVisible={showEditItem} onClose={() => setShowEditItem(false)} selectedItem={selectedItem} />
      </div>
    </Fragment>
  );
};

export default ItemList;
