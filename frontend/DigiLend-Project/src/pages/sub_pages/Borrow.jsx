import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DeleteBorrow from "../../components/DeleteBorrow.jsx";
import Pagination from "../../components/Pagination.jsx";

import confusePeople from "../../assets/confused-people-hehe.png";
import startBorrow from "../../assets/shopping-cart.png";
import borrowList from "../../assets/borrow-list.png";

const Borrow = () => {
  const storedData = localStorage.getItem("akun");
  const userData = JSON.parse(storedData);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get("id");
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/barang`);
      setItems(data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data:", error);
    }
  };

  const selectedItem = items.find((item) => item.id_barang === parseInt(itemId));
  const [formData, setFormData] = useState({
    id_barang: selectedItem ? selectedItem.id_barang : "",
    jumlah_dipinjam: "",
    id_praktikan: userData.id_akun,
  });

  useEffect(() => {
    if (selectedItem) {
      setSelectedButton("startBorrowing");
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: selectedItem.id_barang,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: "",
      }));
    }
  }, [selectedItem]);

  const [selectedButton, setSelectedButton] = useState("");

  const showNotifications = (notification) => {
    notification.forEach((dataNotification) => {
      const message = (
        <div>
          Item: <span className="font-bold">{dataNotification.nama_barang}</span>
          <br />
          Days Remaining: <span className="font-bold"> {dataNotification.daysRemaining} Days</span>
        </div>
      );

      toast.warn(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  };

  const handleClick = (buttonName) => {
    if (buttonName === "borrowList") {
      showNotifications(notification);
    }
    setSelectedButton(buttonName);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [userBorrowTable, setUserBorrowTable] = useState([]);
  const [borrowTable, setBorrowTable] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getUserBorrowData();
    getBorrowData();
  }, []);

  const getUserBorrowData = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/peminjaman/${userData.id_akun}`);
      setUserBorrowTable(data.peminjaman);
      setNotification(data.peminjamanNotification);
    } catch (error) {
      console.error("Kesalahan saat mengambil data peminjaman:", error);
    }
  };

  const getBorrowData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/peminjaman");
      setBorrowTable(data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data peminjaman:", error);
    }
  };

  const filteredUserBorrowTable = Array.isArray(userBorrowTable)
    ? userBorrowTable.filter((item) => {
        if (item) {
          const itemValues = Object.values(item).map((value) => (value ? value.toString().toLowerCase() : ""));
          if (Array.isArray(itemValues)) {
            const searchData = itemValues.join(" ");
            return searchData.includes(searchKeyword.toLowerCase());
          }
        }
        return false;
      })
    : [];

  const filteredBorrowTable = Array.isArray(borrowTable)
    ? borrowTable.filter((item) => {
        if (item) {
          const itemValues = Object.values(item).map((value) => (value ? value.toString().toLowerCase() : ""));
          if (Array.isArray(itemValues)) {
            const searchData = itemValues.join(" ");
            return searchData.includes(searchKeyword.toLowerCase());
          }
        }
        return false;
      })
    : [];

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }

  // Menghitung jumlah halaman total
  const totalUserBorrowPages = Math.ceil(filteredUserBorrowTable.length / itemsPerPage);
  const totalBorrowPages = Math.ceil(filteredBorrowTable.length / itemsPerPage);

  // Menghitung index awal dan akhir data pada halaman saat ini
  const userBorrowStartIndex = (currentTablePage - 1) * itemsPerPage;
  const userBorrowEndIndex = userBorrowStartIndex + itemsPerPage;
  const currentItemsUserBorrow = filteredUserBorrowTable.slice(userBorrowStartIndex, userBorrowEndIndex);

  const borrowStartIndex = (currentTablePage - 1) * itemsPerPage;
  const borrowEndIndex = borrowStartIndex + itemsPerPage;
  const currentItemsBorrow = filteredBorrowTable.slice(borrowStartIndex, borrowEndIndex);

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

  const [borrowItem, setBorrowItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNextClick = () => {
    if (currentPage === 1 && formData.id_barang && formData.jumlah_dipinjam) {
      // Panggil API untuk mendapatkan data barang berdasarkan ID
      axios
        .get(`http://localhost:3000/barang/${formData.id_barang}`)
        .then((response) => {
          const data = response.data;
          setBorrowItem(data); // Mengisi borrowItem dengan data respons dari API
          setErrorMessage(""); // Reset pesan kesalahan jika berhasil

          // Ubah halaman saat tombol "Next" diklik
          setCurrentPage(currentPage + 1);
        })
        .catch((error) => {
          console.error("Kesalahan saat mengambil data barang:", error);
          setErrorMessage("Item not found"); // Set pesan kesalahan jika terjadi kesalahan saat mengambil data barang
        });
    } else {
      setErrorMessage("Please fill in all fields"); // Set pesan kesalahan jika ID barang dan jumlah dipinjam belum diisi
    }
  };

  const isNextButtonDisabled = currentPage === 1 && (!formData.id_barang || !formData.jumlah_dipinjam);
  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/peminjaman", formData)
      .then((response) => {
        // Tangani respons jika sukses
        handleClick("borrowList");
        console.log(response.data);
        getUserBorrowData();
      })
      .catch((error) => {
        // Tangani kesalahan jika terjadi
        console.error(error);
      });
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
          <h1 className="font-Montserrat font-bold sm:text-5xl text-3xl text-accent">Borrow Page</h1>
        </div>
        {userData.id_role === 1 ? (
          <div>
            <div className="p-6 flex items-center">
              <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" value={searchKeyword} onChange={handleSearch} />
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
                {currentItemsBorrow.map((data) => {
                  return (
                    <tr key={data.id_peminjaman} className="text-white">
                      <td>{data.id_peminjaman}</td>
                      <td>{data.id_barang}</td>
                      <td>{data.nama_barang}</td>
                      <td>{data.id_praktikan}</td>
                      <td>{data.jumlah_dipinjam}</td>
                      <td>{formatDate(data.tenggat_waktu)}</td>
                      <td>
                        <button className="btn btn-error text-xs" onClick={() => handleClickDelete(data)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalBorrowPages > 1 && (
              <div className="flex justify-center p-12">
                <Pagination totalPages={totalBorrowPages} currentPage={currentTablePage} onPageChange={handlePageChange} />{" "}
              </div>
            )}
          </div>
        ) : (
          <div>
            {selectedButton === "" && (
              <div className="flex flex-row justify-center pt-6 md:m-0 m-2">
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
                    className="flex flex-col relative justify-center items-center border-2 bg-slate-600 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl sm:text-lg text-sm font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("startBorrowing")}>
                    <img src={startBorrow} alt="Start Borrow" className="md:h-2/3 h-1/2 w-fit" />
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
                    className="flex flex-col relative justify-center items-center border-2 bg-slate-600 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl sm:text-lg text-sm font-bold cursor-pointer text-center shadow-xl"
                    onClick={() => handleClick("borrowList")}>
                    <img src={borrowList} alt="Borrow List" className="md:h-5/6 h-2/3 w-fit" />
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
                          <p>{borrowItem.id_barang}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Item's Name: </p>
                          <p>{borrowItem.nama_barang}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Quantity: </p>
                          <p>{formData.jumlah_dipinjam}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Item's Price: </p>
                          <p>Rp. {borrowItem.harga}</p>
                        </div>
                      </div>
                    )}
                    {currentPage < 2 && (
                      <div className={`flex flex-row ${errorMessage ? "justify-between" : "justify-end"} text-end px-8 items-center`}>
                        {errorMessage && <p className="text-error font-extrabold">{errorMessage}</p>}
                        <button className="btn btn-success" onClick={handleNextClick} disabled={isNextButtonDisabled}>
                          Next
                        </button>
                      </div>
                    )}
                    {currentPage > 1 && (
                      <div className="flex flex-row px-8 justify-between">
                        <button className="btn btn-error" onClick={() => setCurrentPage(currentPage - 1)}>
                          Back
                        </button>
                        <button className="btn btn-success" onClick={handleSubmit}>
                          Submit
                        </button>
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
                      <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" value={searchKeyword} onChange={handleSearch} />
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
                        {currentItemsUserBorrow.map((data) => {
                          return (
                            <tr key={data.id_peminjaman} className="text-white">
                              <td>{data.id_peminjaman}</td>
                              <td>{data.id_barang}</td>
                              <td>{data.nama_barang}</td>
                              <td>{data.jumlah_dipinjam}</td>
                              <td>{formatDate(data.tenggat_waktu)}</td>
                              <td>
                                <Link to={`/dashboard/return?id=${data.id_peminjaman}`} className="btn btn-success text-xs">
                                  Return
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {totalUserBorrowPages > 1 && (
                      <div className="flex justify-center p-12">
                        <Pagination totalPages={totalUserBorrowPages} currentPage={currentTablePage} onPageChange={handlePageChange} />{" "}
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
                      src={confusePeople}
                      alt="Empty Table"
                      className="w-1/6"
                    />
                    <h1 className="text-3xl text-center font-Montserrat w-1/3">Seems like you haven't borrowed anything from Digilend yet.</h1>
                    <button className="btn btn-error font-Montserrat" onClick={() => handleClick("startBorrowing")}>
                      Borrow Something
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />{" "}
      <DeleteBorrow isVisible={showDeleteItem} onClose={() => setShowDeleteItem(false)} deleteItem={deleteItem} />
    </Fragment>
  );
};

export default Borrow;
