import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import returnItem from "../../assets/return-item.png";
import returnList from "../../assets/check-list.png";
import DeleteReturn from "../../components/DeleteReturn.jsx";
import Pagination from "../../components/Pagination.jsx";
import { AiOutlineSearch } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";

const Return = () => {
  const userData = window.userData;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const borrowId = searchParams.get("id");
  // tabel peminjaman seluruh user
  const [borrowData, setBorrowData] = useState([]);

  console.log("borrow id: ", borrowId);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setBorrowData(data);
    console.log(data);
  };

  const selectedItem = borrowData.find((item) => item.id === parseInt(borrowId));
  console.log("selected item:", selectedItem);
  console.log(selectedItem);
  const [formData, setFormData] = useState({
    id_peminjaman: selectedItem ? selectedItem.id : "",
    nama_barang: selectedItem ? selectedItem.name : "",
    jumlah_barang: selectedItem ? selectedItem.email : "",
    jumlah_dikembalikan: "",
    bukti_pembayaran: "",
    waktu_pengembalian: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setSelectedButton("returnReport");

      setFormData((prevFormData) => ({
        ...prevFormData,
        id_peminjaman: selectedItem.id,
        nama_barang: selectedItem.name,
        jumlah_barang: selectedItem.email,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_peminjaman: "",
        nama_barang: "",
        jumlah_barang: "",
      }));
    }
  }, [selectedItem]);

  const [selectedButton, setSelectedButton] = useState("");

  const handleClick = (button) => {
    setSelectedButton(button);
  };
  const [userReturnTable, setUserReturnTable] = useState([]);
  const [returnTable, setReturnTable] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getUserReturnTable();
    getReturnTable();
  }, []);

  const getUserReturnTable = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");
    setUserReturnTable(data);
  };

  const getReturnTable = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");
    setReturnTable(data);
  };

  const filteredUserReturnTable = userReturnTable.filter((item) => {
    const itemValues = Object.values(item).map((value) => value.toString().toLowerCase());
    const searchData = itemValues.join(" ");
    return searchData.includes(searchKeyword.toLowerCase());
  });

  const filteredReturnTable = returnTable.filter((item) => {
    const itemValues = Object.values(item).map((value) => value.toString().toLowerCase());
    const searchData = itemValues.join(" ");
    return searchData.includes(searchKeyword.toLowerCase());
  });

  // Menghitung jumlah halaman total
  const totalUserReturnPages = Math.ceil(filteredUserReturnTable.length / itemsPerPage);
  const totalReturnPages = Math.ceil(filteredReturnTable.length / itemsPerPage);

  // Menghitung index awal dan akhir data pada halaman saat ini
  const userReturnStartIndex = (currentTablePage - 1) * itemsPerPage;
  const userReturnEndIndex = userReturnStartIndex + itemsPerPage;
  const currentItemsUserReturn = filteredUserReturnTable.slice(userReturnStartIndex, userReturnEndIndex);

  const returnStartIndex = (currentTablePage - 1) * itemsPerPage;
  const returnEndIndex = returnStartIndex + itemsPerPage;
  const currentItemsReturn = filteredReturnTable.slice(returnStartIndex, returnEndIndex);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (page) => {
    setCurrentTablePage(page);
  };

  // Fungsi untuk meng-handle perubahan input pencarian
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentTablePage(1); // Set halaman kembali ke 1 setelah pencarian berubah
  };

  const [showDeleteItem, setShowDeleteItem] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);

  const handleClickDelete = (data) => {
    setDeleteItem(data);
    setShowDeleteItem((prevState) => !prevState);
  };

  const handleSubmit = () => {
    axios
      .post("URL_ENDPOINT", formData)
      .then((response) => {
        // Tangani respons jika sukses
        console.log(response.data);
      })
      .catch((error) => {
        // Tangani kesalahan jika terjadi
        console.error(error);
      });
  };
  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const returnPage = document.getElementById("returnPage");
    returnPage.style.width = `calc(100vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <Fragment>
      <div id="returnPage" className="overflow-x-auto space-y-8">
        <div className="flex flex-col items-center pt-6">
          <h1 className="font-Montserrat font-bold text-5xl text-accent">Return Page</h1>
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
                  <th>Borrow's ID</th>
                  <th>Return Amount</th>
                  <th>Return Timestamp</th>
                  <th>Penalty</th>
                  <th>Compensation</th>
                  <th>Total Penalty</th>
                  <th>Proof of Payment</th>
                </tr>
              </thead>
              <tbody>
                {currentItemsReturn.map((data) => {
                  return (
                    <tr key={data.id_pengembalian} className="text-white">
                      <td>{data.id_pengembalian}</td>
                      <td>{data.id_peminjaman}</td>
                      <td>{data.jumlah_dikembalikan}</td>
                      <td>{data.waktu_pengembalian}</td>
                      <td>{data.denda}</td>
                      <td>{data.ganti_rugi}</td>
                      <td>{data.total_sanksi}</td>
                      <td>{data.bukti_pembayaran}</td>
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
            {totalReturnPages > 1 && (
              <div className="flex justify-center p-12">
                <Pagination totalPages={totalReturnPages} currentPage={currentTablePage} onPageChange={handlePageChange} />
              </div>
            )}
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
                    className="flex flex-col relative justify-center items-center border-2 bg-[#40476c] hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("returnReport")}>
                    <img src={returnItem} alt="Return" className="sm:h-2/3 w-fit" />
                    <p className="absolute bottom-3 md:bottom-6 text-center">Report a Return</p>
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
                    className="flex flex-col relative justify-center items-center border-2 bg-[#40476c] hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("returnList")}>
                    <img src={returnList} alt="Return List" className="md:h-4/6 w-fit" />
                    <p className="absolute bottom-3 md:bottom-6 text-center">Your Return's History</p>
                  </motion.div>
                </div>
              </div>
            )}

            {selectedButton === "returnReport" && (
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
                    <div className="flex flex-row">
                      <div className="flex flex-col items-center text-white space-y-6 w-full px-8">
                        <input
                          type="text"
                          placeholder="Enter Your Borrow's ID"
                          className="input input-bordered bg-neutral input-accent w-full"
                          value={formData.id_peminjaman}
                          onChange={(e) => {
                            const inputId = e.target.value.replace(/\D/g, "");
                            setFormData({ ...formData, id_peminjaman: inputId });
                          }}
                        />
                        <input
                          type="number"
                          placeholder="Enter the Quantity of Returned Items"
                          className="input input-bordered bg-neutral input-accent w-full"
                          value={formData.jumlah_dikembalikan}
                          onChange={(e) => setFormData({ ...formData, jumlah_dikembalikan: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Enter The Proof of Your Payment"
                          className="input input-bordered bg-neutral input-accent w-full"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row px-8 justify-end">
                      <button className="btn btn-success" onClick={handleSubmit}>
                        Submit
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            {selectedButton === "returnList" && (
              <div className="borrow-list">
                <BsArrowLeft className="absolute top-24 left-40 text-5xl text-accent cursor-pointer" onClick={() => handleClick("")} />
                {userReturnTable.length > 0 ? (
                  <div>
                    <div className="p-6 flex items-center">
                      <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" />
                      <AiOutlineSearch className="text-2xl -translate-x-10" />
                    </div>
                    <table className="table table-zebra shadow-xl w-full">
                      <thead>
                        <tr className="text-white">
                          <th></th>
                          <th>Borrow's ID</th>
                          <th>Return Amount</th>
                          <th>Return Timestamp</th>
                          <th>Penalty</th>
                          <th>Compensation</th>
                          <th>Total Penalty</th>
                          <th>Proof of Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItemsUserReturn.map((data) => {
                          return (
                            <tr key={data.id_pengembalian} className="text-white">
                              <td>{data.id_pengembalian}</td>
                              <td>{data.id_peminjaman}</td>
                              <td>{data.jumlah_dikembalikan}</td>
                              <td>{data.waktu_pengembalian}</td>
                              <td>{data.denda}</td>
                              <td>{data.ganti_rugi}</td>
                              <td>{data.total_sanksi}</td>
                              <td>{data.bukti_pembayaran}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {totalUserReturnPages > 1 && (
                      <div className="flex justify-center p-12">
                        <Pagination totalPages={totalUserReturnPages} currentPage={currentTablePage} onPageChange={handlePageChange} />
                      </div>
                    )}
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
                      src=""
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
      <DeleteReturn isVisible={showDeleteItem} onClose={() => setShowDeleteItem(false)} deleteItem={deleteItem} />
    </Fragment>
  );
};

export default Return;
