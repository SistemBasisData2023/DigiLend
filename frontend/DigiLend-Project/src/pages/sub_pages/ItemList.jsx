import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineSearch, AiOutlinePlusCircle } from "react-icons/ai";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

import EditItem from "../../components/EditItem.jsx";
import DeleteItem from "../../components/DeleteItem.jsx";
import AddItem from "../../components/AddItem.jsx";
import Pagination from "../../components/Pagination.jsx";

const ItemList = () => {
  const userData = window.userData;
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [showDeleteItem, setShowDeleteItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data berdasarkan keyword pencarian
  const filteredItems = items.filter((item) => {
    const itemValues = Object.values(item).map((value) => value.toString().toLowerCase());
    const searchData = itemValues.join(" ");
    return searchData.includes(searchKeyword.toLowerCase());
  });
  // Menghitung jumlah halaman total
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Menghitung index awal dan akhir data pada halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk meng-handle perubahan input pencarian
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Set halaman kembali ke 1 setelah pencarian berubah
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setItems(data);
    console.log(data);
  };

  const handleClickAdd = (data) => {
    setShowAddItem((prevState) => !prevState);
  };

  const handleClickEdit = (data) => {
    setSelectedItem(data);
    setShowEditItem((prevState) => !prevState);
    setIsDropdownOpen(false);
  };

  const handleClickDelete = (data) => {
    setSelectedItem(data);
    setShowDeleteItem((prevState) => !prevState);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
          <h1 className="font-Montserrat font-bold sm:text-5xl text-3xl text-accent">Item List</h1>
        </div>
        <div className="p-6 flex flex-row justify-between">
          <div className="flex">
            <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" value={searchKeyword} onChange={handleSearch} />
            <AiOutlineSearch className="text-2xl -translate-x-11 translate-y-3" />
          </div>
          {userData.id_role === 0 && (
            <div className="btn btn-ghost flex flex-row items-center gap-3 px-6" onClick={() => handleClickAdd()}>
              <AiOutlinePlusCircle className="text-3xl" />
              <span className="text-lg">Add Item</span>
            </div>
          )}
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
            {currentItems.map((data) => {
              return (
                <tr key={data.id} className="text-white">
                  <td>{data.id}</td>
                  <td>{data.name}</td>
                  <td>{data.name}</td>
                  <td>{data.username}</td>
                  <td>
                    {userData.id_role === 0 ? (
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle shadow-xl" onClick={handleDropdownToggle}>
                          <IoEllipsisVerticalSharp />
                        </label>
                        {isDropdownOpen && (
                          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li>
                              <a onClick={() => handleClickEdit(data)}>Edit</a>
                            </li>
                            <li>
                              <a onClick={() => handleClickDelete(data)}>Delete</a>
                            </li>
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link tabIndex={0} className="btn btn-ghost btn-circle shadow-xl" to={`/dashboard/borrow?id=${data.id}`}>
                        <IoEllipsisVerticalSharp />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Render pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
      <DeleteItem isVisible={showDeleteItem} onClose={() => setShowDeleteItem(false)} selectedItem={selectedItem} />
      <EditItem isVisible={showEditItem} onClose={() => setShowEditItem(false)} selectedItem={selectedItem} />
      <AddItem isVisible={showAddItem} onClose={() => setShowAddItem(false)} />
    </Fragment>
  );
};

export default ItemList;
