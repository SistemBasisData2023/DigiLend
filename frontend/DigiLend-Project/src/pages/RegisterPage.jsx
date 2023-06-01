import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye, AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import Background from "../components/background/background.jsx";
import digilendLogo from "../assets/logo-no-background.png";
import assistant from "../assets/Laboratory-Assistant.png";
import practician from "../assets/Practician.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [batch, setBatch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState("labAssistant");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [open, setOpen] = useState(false); // State untuk menyimpan opsi yang dipilih
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Jumlah total halaman pada carousel
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const handleClick = (option) => {
    setSelectedOption(option);
  };
  const handleStudentIdChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    setStudentId(inputValue);
  };
  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    setPhoneNumber(inputValue);
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const toggle = () => {
    setOpen(!open);
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
          className="bg-[#FAFAFA] sm:mr-24 backdrop-blur-sm rounded-2xl w-4/5 h-[25rem] sm:w-[45rem] sm:h-[30rem] border-2 shadow-2xl border-solid border-opacity-100">
          <div className="my-5 space-y-4 sm:p-8">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-info text-center font-Montserrat">Register Account</h1>
            {currentPage === 1 && (
              <div className="flex flex-row justify-center md:gap-10 gap-4 md:h-64 pt-4 md:m-0 m-2">
                <div
                  className={`flex flex-col justify-center items-center border-2 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg text-black font-bold cursor-pointer ${
                    selectedOption === "labAssistant" ? "bg-[#B8C1F9] text-white" : ""
                  }`}
                  onClick={() => handleClick("labAssistant")}>
                  <img src={assistant} alt="Lab Assistant" className="md:h-5/6 w-fit" />
                  Lab Assistant
                </div>
                <div
                  className={`flex flex-col justify-center items-center border-2 hover:border-[#B8C1F9] w-full p-4 rounded-2xl md:text-xl text-lg text-black font-bold cursor-pointer ${
                    selectedOption === "practician" ? "bg-[#B8C1F9] text-white" : ""
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
                  <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered input-info w-full bg-white border-2 text-black" />
                </div>
                <div className="flex">
                  <input type="text" value={studentId} onChange={handleStudentIdChange} placeholder="Student ID Number" className="input input-bordered input-info w-full bg-white border-2 text-black" />{" "}
                </div>
                <div className="flex justify-between space-x-2 md:space-x-0">
                  <select value={major} onChange={(e) => setMajor(e.target.value)} className="select select-info w-1/2 md:w-full max-w-xs bg-white border-2 text-black font-normal">
                    <option disabled selected>
                      Major
                    </option>
                    <option>Electrical Engineering</option>
                    <option>Computer Engineering</option>
                    <option>Biomedical Engineering</option>
                  </select>
                  <select value={batch} onChange={(e) => setBatch(e.target.value)} className="select select-info w-2/5 md:w-full max-w-xs bg-white border-2 text-black font-normal">
                    <option disabled selected>
                      Batch
                    </option>
                    <option>2018</option>
                    <option>2019</option>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                  </select>
                </div>
                <div className="flex">
                  <input type="text" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Phone Number" className="input input-bordered input-info w-full bg-white border-2 text-black" />
                </div>
              </div>
            )}
            {currentPage === 3 && <div>halo</div>}
            <div className="flex flex-row absolute bottom-0 md:py-6 md:p-0 p-3 text-4xl md:text-5xl gap-4">
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
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
