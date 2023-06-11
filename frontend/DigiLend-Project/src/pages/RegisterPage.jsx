import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye, AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "../components/background/background.jsx";
import digilendLogo from "../assets/logo-no-background.png";
import assistant from "../assets/Laboratory-Assistant.png";
import practician from "../assets/Practician.png";
import secure from "../assets/Secure.png";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_role: 1,
    nama: "",
    npm: "",
    username: "",
    password: "",
    nama_kelompok: "",
    kode_aslab: "",
    jurusan: "Teknik Elektro",
    telepon: "",
    tahun_ajaran: "2022-2023",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Menggunakan value dari input sebagai nilainya
    }));
  };

  const handleStudentIdChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    handleChange({ target: { name: "npm", value: inputValue } });
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    handleChange({ target: { name: "telepon", value: inputValue } });
  };

  const handleClick = (option) => {
    if (option === "labAssistant") {
      handleChange({ target: { name: "id_role", value: 1 } });
      handleChange({ target: { name: "nama_kelompok", value: "" } });
    } else if (option === "practician") {
      handleChange({ target: { name: "id_role", value: 0 } });
      handleChange({ target: { name: "kode_aslab", value: "" } });
    }
  };

  const [groupList, setGroupList] = useState([]);
  const [tahunAjaran, setTahunAjaran] = useState([]);

  useEffect(() => {
    getTahunAjaranData();
  }, []);

  useEffect(() => {
    const getGroupData = async () => {
      try {
        if (formData.tahun_ajaran) {
          const response = await axios.get(`http://localhost:3000/nama_kelompok/${formData.tahun_ajaran}`);
          const data = response.data;
          setGroupList(data);
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil data kelompok:", error);
      }
    };

    getGroupData();
  }, [formData.tahun_ajaran]);

  const getTahunAjaranData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tahun_ajaran");
      const data = response.data;
      setTahunAjaran(data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data tahun ajaran:", error);
    }
  };

  const [open, setOpen] = useState(false); // State untuk menyimpan opsi yang dipilih

  const toggle = () => {
    setOpen(!open);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Jumlah total halaman pada carousel
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Cek apakah ada bidang yang kosong
    const isFormEmpty = Object.values(formData).some((value) => value === "");

    if (isFormEmpty) {
      toast.error("Please fill in all fields.", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }

    axios
      .post("http://localhost:3000/register", formData)
      .then((response) => {
        // Setelah menerima respons dari backend
        const token = response.data.token;
        const akun = response.data.akun;
        localStorage.setItem("token", token);
        localStorage.setItem("akun", JSON.stringify(akun));
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Kesalahan saat mendaftarkan akun:", error);
      });
  };

  return (
    <motion.div className="w-full h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Background></Background>
      <div className="flex flex-col md:flex-row items-center md:justify-around mx-auto h-screen">
        <img src={digilendLogo} alt="Digilend" className="md:absolute md:top-0 md:left-0 md:m-10 md:h-24 h-16 w-fit" />
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 5,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          className="bg-[#FAFAFA] md:mr-24 backdrop-blur-sm rounded-2xl w-4/5 h-[30rem] sm:w-[45rem] sm:h-[33rem] border-2 shadow-2xl border-solid border-opacity-100">
          <div className="my-5 space-y-4 sm:p-8">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-info text-center font-Montserrat">Register Account</h1>
            {currentPage === 1 && (
              <div className="flex flex-row justify-center md:gap-10 gap-4 md:h-72 sm:pt-4 pt-10 md:m-0 m-2">
                <div
                  className={`flex flex-col justify-center items-center border-2 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg text-black font-bold cursor-pointer ${
                    formData.id_role === 1 ? "bg-[#B8C1F9] text-white" : ""
                  }`}
                  onClick={() => handleClick("labAssistant")}>
                  <img src={assistant} alt="Lab Assistant" className="md:h-5/6 w-fit" />
                  Lab Assistant
                </div>
                <div
                  className={`flex flex-col justify-center items-center border-2 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg text-black font-bold cursor-pointer ${
                    formData.id_role === 0 ? "bg-[#B8C1F9] text-white" : ""
                  }`}
                  onClick={() => handleClick("practician")}>
                  <img src={practician} alt="Practician" className="md:h-5/6 w-fit" />
                  Practician
                </div>
              </div>
            )}
            {currentPage === 2 && (
              <div className="space-y-4 pt-3 p-3 sm:p-0">
                <div className="flex">
                  <input type="text" placeholder="Full Name" name="nama" value={formData.nama} onChange={handleChange} className="input input-bordered input-info w-full bg-white border-2 text-black" />
                </div>
                <div className="flex">
                  <input type="text" placeholder="Student ID Number" name="npm" value={formData.npm} onChange={handleStudentIdChange} className="input input-bordered input-info w-full bg-white border-2 text-black" />{" "}
                </div>
                <div className="flex justify-between space-x-2 md:space-x-0">
                  <select name="jurusan" value={formData.jurusan} onChange={handleChange} className="select select-info w-full bg-white border-2 text-black font-normal">
                    <option disabled selected>
                      Major
                    </option>
                    <option value="Teknik Elektro">Electrical Engineering</option>
                    <option value="Teknik Komputer">Computer Engineering</option>
                    <option value="Teknik Biomedik">Biomedical Engineering</option>
                  </select>
                </div>
                <div className="flex">
                  <input type="text" placeholder="Phone Number" name="telepon" value={formData.telepon} onChange={handlePhoneNumberChange} className="input input-bordered input-info w-full bg-white border-2 text-black" />
                </div>
                {formData.id_role === 1 ? (
                  <div className="flex">
                    <input type="text" placeholder="Lab Assistant Code" name="kode_aslab" value={formData.kode_aslab} onChange={handleChange} className="input input-bordered input-info w-full bg-white border-2 text-black" />
                  </div>
                ) : (
                  <div className="flex justify-between space-x-2 md:space-x-0">
                    <select name="tahun_ajaran" value={formData.tahun_ajaran} onChange={handleChange} className="select select-info w-2/5 md:w-full max-w-xs bg-white border-2 text-black font-normal">
                      <option disabled selected>
                        Academic Year
                      </option>
                      {tahunAjaran.map((getTahunAjaranData) => (
                        <option key={getTahunAjaranData}>{getTahunAjaranData}</option>
                      ))}
                    </select>
                    {formData.tahun_ajaran && (
                      <select name="nama_kelompok" value={formData.nama_kelompok} onChange={handleChange} className="select select-info w-1/2 md:w-full max-w-xs bg-white border-2 text-black font-normal">
                        <option disabled selected>
                          Group Id
                        </option>
                        {groupList.map((groupData) => (
                          <option key={groupData}>{groupData}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
              </div>
            )}
            {currentPage === 3 && (
              <div className="space-y-4 pt-3">
                <div className="flex flex-row items-center justify-center">
                  <img src={secure} alt="Register" className="sm:h-28 h-24" />
                </div>
                <div className="flex justify-center">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    className="input input-bordered input-info w-full md:w-5/6 bg-white border-2 text-black text-xl mx-5 md:mx-0"
                    required=""
                    value={formData.username}
                    onChange={handleChange}
                    onKeyUp={(e) => {
                      if (e.target.value !== "") {
                        e.target.classList.add("border-2");
                      } else {
                        e.target.classList.remove("border-2");
                      }
                    }}
                  />
                </div>
                <div>
                  <div className="relative flex justify-center">
                    <input
                      type={open === false ? "password" : "text"}
                      name="password"
                      id="password"
                      placeholder="Password"
                      className="input input-bordered input-info w-full md:w-5/6 bg-white border-2 text-black text-xl mx-5 md:mx-0"
                      required=""
                      value={formData.password}
                      onChange={handleChange}
                      onKeyUp={(e) => {
                        if (e.target.value !== "") {
                          e.target.classList.add("border-2");
                        } else {
                          e.target.classList.remove("border-2");
                        }
                      }}
                    />
                    <button type="button" className="text-3xl absolute bottom-[20%] right-[12%]" onClick={toggle}>
                      {open === false ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end mr-5 md:mr-9">
                  <button className="button btn btn-info md:w-32 md:h-8 rounded-3xl md:text-lg text-md font-Inter text-white" onClick={handleSubmit}>
                    REGISTER
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-row absolute bottom-0 md:py-6 md:p-0 p-3 text-4xl md:text-5xl gap-2 md:gap-4">
              <motion.div
                whileHover={!isPreviousDisabled ? { scale: 1.2 } : {}}
                whileTap={!isPreviousDisabled ? { scale: 0.9 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={!isPreviousDisabled ? handlePreviousPage : undefined}>
                <AiFillLeftCircle className={`cursor-pointer text-info ${isPreviousDisabled ? "opacity-50" : ""}`} />
              </motion.div>
              <motion.div
                whileHover={!isNextDisabled ? { scale: 1.2 } : {}}
                whileTap={!isNextDisabled ? { scale: 0.9 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={!isNextDisabled ? handleNextPage : undefined}>
                <AiFillRightCircle className={`cursor-pointer text-info ${isNextDisabled ? "opacity-50" : ""}`} />
              </motion.div>
            </div>
            <p className="absolute bottom-0 right-0 sm:px-8 md:p-10 py-6 text-[0.7rem] sm:text-lg font-Montserrat text-gray-500">
              Already have Account?
              <a href="/login" className="font-Montserrat ml-1 mr-7 text-info hover:underline">
                Log In
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </motion.div>
  );
};

export default RegisterPage;
