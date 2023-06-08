import axios from "axios";
import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import DeleteBorrow from "../../components/DeleteBorrow.jsx";
import confusePeople from "../../assets/confused-people-hehe.png";
import startBorrow from "../../assets/shopping-cart.png";
import borrowList from "../../assets/borrow-list.png";
import { AiOutlineSearch } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

const Borrow = () => {
  const userData = window.userData;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get("id");
  const [items, setItems] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setItems(data);
    console.log(data);
  };

  const selectedItem = items.find((item) => item.id === parseInt(itemId));
  console.log(selectedItem);
  const [formData, setFormData] = useState({
    id_barang: selectedItem ? selectedItem.id : "",
    name: selectedItem ? selectedItem.id : "",
    jumlah_dipinjam: "",
    id_praktikan: 0,
  });

  useEffect(() => {
    if (selectedItem) {
      setSelectedButton("startBorrowing");
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: selectedItem.id,
        name: selectedItem.name,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: "",
        name: "",
      }));
    }
  }, [selectedItem]);

  const [selectedButton, setSelectedButton] = useState("");

  const handleClick = (button) => {
    setSelectedButton(button);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [userBorrowTable, setUserBorrowTable] = useState([]);
  useEffect(() => {
    getUserBorrowData();
  }, []);

  const getUserBorrowData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setUserBorrowTable(data);
    console.log(data);
  };
  const [borrowTable, setBorrowTable] = useState([]);
  useEffect(() => {
    getBorrowData();
  }, []);

  const getBorrowData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setBorrowTable(data);
    console.log(data);
  };
  const [showDeleteItem, setShowDeleteItem] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);

  const handleClickDelete = (data) => {
    setDeleteItem(data);
    setShowDeleteItem((prevState) => !prevState);
  };

  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const borrowPage = document.getElementById("borrowPage");
    borrowPage.style.width = `calc(100vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <Fragment>
      <div id="borrowPage" className="overflow-x-auto space-y-8">
        <div className="flex flex-col items-center pt-6">
          <h1 className="font-Montserrat font-bold text-5xl text-accent">Borrow Page</h1>
        </div>
        {userData.id_role === 0 ? (
          <div>
            <div className="p-6 flex items-center">
              <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" />
              <AiOutlineSearch className="text-2xl -translate-x-10" />
            </div>
            <table className="table table-zebra shadow-xl w-full">
              <thead>
                <tr className="text-white">
                  <th></th>
                  <th>Item's ID</th>
                  <th>Item's Name</th>
                  <th>User's ID</th>
                  <th>Quantity</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {borrowTable.map((data) => {
                  return (
                    <tr key={data.id} className="text-white">
                      <td>{data.id}</td>
                      <td>{data.name}</td>
                      <td>itemname</td>
                      <td>userid</td>
                      <td>{data.username}</td>
                      <td>KAPAN</td>
                      <td>
                        <button class="btn btn-error text-xs" onClick={() => handleClickDelete(data)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {selectedButton === "" && (
              <div className="flex flex-row justify-center md:h-96 pt-6 md:m-0 m-2">
                <div className="flex flex-row gap-6 md:w-2/3 md:gap-14">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: [null, 1.1, 1.05] }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className="flex flex-col relative justify-center items-center border-2 bg-slate-600 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("startBorrowing")}>
                    <img src={startBorrow} alt="Start Borrow" className="sm:h-2/3 w-fit" />
                    <p className="absolute bottom-3 md:bottom-6">Start Borrowing</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: [null, 1.1, 1.05] }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    className="flex flex-col relative justify-center items-center border-2 bg-slate-600 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("borrowList")}>
                    <img src={borrowList} alt="Borrow List" className="md:h-5/6 w-fit" />
                    <p className="absolute bottom-3 md:bottom-6">Borrow List</p>
                  </motion.div>
                </div>
              </div>
            )}

            {selectedButton === "startBorrowing" && (
              <div className="flex flex-col items-center pt-8">
                <BsArrowLeft className="absolute top-24 left-40 text-5xl text-accent cursor-pointer" onClick={() => handleClick("")} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="bg-neutral rounded-2xl w-2/3 md:w-2/5 border-2 ring-2 border-info">
                  <div className="backdrop-blur-sm p-12 space-y-8 ">
                    <h1 className="font-Montserrat text-3xl font-bold text-center">DigiCard</h1>
                    {currentPage === 1 && (
                      <div className="flex flex-col items-center text-white space-y-6 w-full px-8">
                        <input
                          type="text"
                          placeholder="Enter The Item's ID"
                          className="input input-bordered bg-neutral input-accent w-full"
                          value={formData.id_barang}
                          onChange={(e) => {
                            const inputId = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, id_barang: inputId });
                          }}
                        />
                        <input type="text" placeholder="Enter The Item's Name" className="input input-bordered bg-neutral input-accent w-full" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input
                          type="number"
                          placeholder="Enter the Quantity"
                          className="input input-bordered bg-neutral input-accent w-full"
                          value={formData.jumlah_dipinjam}
                          onChange={(e) => setFormData({ ...formData, jumlah_dipinjam: e.target.value })}
                        />
                      </div>
                    )}
                    {currentPage === 2 && (
                      <div className="flex flex-col text-white space-y-4 w-full px-8 font-Montserrat">
                        <div className="flex flex-row justify-between">
                          <p>Item's ID: </p>
                          <p>{formData.id_barang}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Item's Name: </p>
                          <p>{formData.name}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Quantity: </p>
                          <p>{formData.jumlah_dipinjam}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Item's Price: </p>
                          <p>Rp. {selectedItem ? selectedItem.price : ""}</p>
                        </div>
                      </div>
                    )}
                    {currentPage < 2 && (
                      <div className="text-end px-8">
                        <button className="btn btn-success" onClick={() => setCurrentPage(currentPage + 1)}>
                          Next
                        </button>
                      </div>
                    )}
                    {currentPage > 1 && (
                      <div className="flex flex-row px-8 justify-between">
                        <button className="btn btn-error" onClick={() => setCurrentPage(currentPage - 1)}>
                          Back
                        </button>
                        <button className="btn btn-success">Submit</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
            {selectedButton === "borrowList" && (
              <div className="borrow-list">
                <BsArrowLeft className="absolute top-24 left-40 text-5xl text-accent cursor-pointer" onClick={() => handleClick("")} />
                {userBorrowTable.length > 0 ? (
                  <div>
                    <div className="p-6 flex items-center">
                      <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" />
                      <AiOutlineSearch className="text-2xl -translate-x-10" />
                    </div>
                    <table className="table table-zebra shadow-xl w-full">
                      <thead>
                        <tr className="text-white">
                          <th>Borrow's ID</th>
                          <th>Item's ID</th>
                          <th>Item's Name</th>
                          <th>Quantity</th>
                          <th>Deadline</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBorrowTable.map((data) => {
                          return (
                            <tr key={data.id} className="text-white">
                              <td>{data.id}</td>
                              <td>{data.name}</td>
                              <td>{data.name}</td>
                              <td>{data.username}</td>
                              <td>KAPAN</td>
                              <td>
                                <Link to={`/dashboard/return?id=${data.id}`} class="btn btn-success text-xs">
                                  Return
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <motion.img
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      while={{ scale: 1 }}
                      src={confusePeople}
                      alt="Empty Table"
                      className="w-1/6"
                    />
                    <h1 className="text-3xl text-center font-Montserrat w-1/3">Seems like you haven't borrowed anything from Digilend yet.</h1>
                    <button class="btn btn-error font-Montserrat" onClick={() => handleClick("startBorrowing")}>
                      Borrow Something
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <DeleteBorrow isVisible={showDeleteItem} onClose={() => setShowDeleteItem(false)} deleteItem={deleteItem} />
    </Fragment>
  );
};

export default Borrow;
