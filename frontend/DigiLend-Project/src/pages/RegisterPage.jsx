import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye, AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import Background from "../components/background/background.jsx";
import digilendLogo from "../assets/logo-no-background.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [batch, setBatch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("labAssistant"); // State untuk menyimpan opsi yang dipilih

  const handleStudentIdChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    setStudentId(inputValue);
  };
  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "");
    setPhoneNumber(inputValue);
  };
  const handleClick = (option) => {
    setSelectedOption(option);
  };

  const toggle = () => {
    setOpen(!open);
  };
  const handleSubmit = (e) => {
    e.preventDefault;
    if (selectedOption === "labAssistant") {
      // Tindakan untuk Lab Assistant
    } else if (selectedOption === "practician") {
      // Tindakan untuk Practician
    } else {
      // Opsi tidak valid, mungkin perlu menampilkan pesan kesalahan
    }
  };
  return (
    <motion.div className="w-full h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Background></Background>
      <div className="flex flex-col md:flex-row items-center md:justify-around mx-auto h-screen">
        <img src={digilendLogo} alt="Digilend" className="absolute top-0 left-0 md:m-10 md:h-24 h-16 w-fit" />
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
          className="bg-[#FAFAFA] sm:mr-24 backdrop-blur-sm rounded-2xl w-4/5 min-h-[15rem] sm:w-[45rem] sm:h-[30rem] border-2 shadow-2xl border-solid border-opacity-100">
          <div className="my-5 space-y-4 sm:p-8">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight text-info text-center font-Montserrat">Register Account</h1>
            <form className="space-y-4 pt-3 p-3 sm:p-0" action="#" onSubmit={handleSubmit}>
              <div className="flex">
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered input-info w-full bg-white border-2 text-black" />
              </div>
              <div className="flex">
                <input type="text" value={studentId} onChange={handleStudentIdChange} placeholder="Student ID Number" className="input input-bordered input-info w-full bg-white border-2 text-black" />{" "}
              </div>
              <div className="flex justify-between space-x-2 md:space-x-0">
                <select value={major} onChange={(e) => setMajor(e.target.value)} className="select select-info w-full max-w-xs bg-white border-2 text-black font-normal">
                  <option disabled selected>
                    Major
                  </option>
                  <option>Electrical Engineering</option>
                  <option>Computer Engineering</option>
                  <option>Biomedical Engineering</option>
                </select>
                <select value={batch} onChange={(e) => setBatch(e.target.value)} className="select select-info w-full max-w-xs bg-white border-2 text-black font-normal">
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
            </form>
            <div className="flex flex-row absolute bottom-0 py-6 text-5xl gap-4">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <AiFillLeftCircle className="cursor-pointer text-info " />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <AiFillRightCircle className="cursor-pointer text-info " />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
