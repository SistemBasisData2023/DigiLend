import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import digilendLogo from "../assets/logo-no-background.png";
import Background from "../components/background/background.jsx";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    idakun: 0,
    username: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleClick = (option) => {
    option === "labAssistant" && handleChange({ target: { name: "idakun", value: 0 } });
    option === "practician" && handleChange({ target: { name: "idakun", value: 1 } });
  };

  const toggle = () => {
    setOpen(!open);
  };
  const handleSubmit = (e) => {
    e.preventDefault;
    if (formData.idakun === 0) {
      // Tindakan untuk Lab Assistant
    } else if (formData.idakun === 1) {
      // Tindakan untuk Practician
    } else {
      // Opsi tidak valid, mungkin perlu menampilkan pesan kesalahan
    }
  };
  return (
    <motion.div className="w-full h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Background></Background>
      <div className="flex flex-col md:flex-row items-center md:justify-around mx-auto h-screen">
        <img src={digilendLogo} className="lg:h-[380px] md:h-[280px] h-[160px]" alt="Digilend" />
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
          className="bg-[#FAFAFA] md:mr-24 backdrop-blur-sm rounded-2xl min-w-[20rem] min-h-[24rem] sm:w-[26rem] sm:h-[30rem] border-2 shadow-2xl border-solid border-opacity-100">
          <div className="my-5 space-y-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-info text-center font-Montserrat">Choose Account Type</h1>
            <div className="flex flex-row justify-center space-x-5">
              <div
                className={`flex justify-center border-2 hover:border-[#B8C1F9] w-40 p-4 rounded-2xl text-xl text-black font-bold cursor-pointer ${formData.idakun === 0 ? "bg-[#B8C1F9] text-white" : ""}`}
                onClick={() => handleClick("labAssistant")}>
                Lab Assistant
              </div>

              <div
                className={`flex justify-center border-2 hover:border-[#B8C1F9] w-40 p-4 rounded-2xl text-xl text-black font-bold cursor-pointer ${formData.idakun === 1 ? "bg-[#B8C1F9] text-white" : ""}`}
                onClick={() => handleClick("practician")}>
                Practician
              </div>
            </div>
            <div>
              <h2 className="flex justify-center font-semibold">{formData.idakun === 0 ? "Hello Lab Assistant!" : "Hello Practician!"}</h2>
              <h2 className="flex justify-center font-semibold">Please fill out the form below to get started</h2>
            </div>
            <form className="space-y-4 pt-3" action="#" onSubmit={handleSubmit}>
              <div className="flex justify-center">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="input input-bordered input-info w-full max-w-xs bg-gray-50 placeholder:text-lg placeholder:sm:text-xl text-gray-900 font-Inter px-5 sm:px-8 sm:text-xl rounded-full"
                  placeholder="Username"
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
                    className="input input-bordered input-info w-full max-w-xs bg-gray-50 placeholder:text-lg placeholder:sm:text-xl text-gray-900 font-Inter px-5 sm:px-8 sm:text-xl rounded-full"
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
                  <button type="button" className="text-3xl absolute bottom-[20%] right-[15%]" onClick={toggle}>
                    {open === false ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <p className="sm:p-1.5 p-1 text-sm text-center font-Montserrat text-gray-500">
                  No account?
                  <a href="/register" className="font-Montserrat ml-1 mr-7 text-info hover:underline">
                    Register
                  </a>
                </p>
                <button type="submit" className="p-2 px-7 hover:bg-info-content bg-info text-gray-50 font-Inter sm:text-lg w-fit h-fit rounded-2xl shadow-xl border-solid border-2">
                  LOGIN
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </motion.div>
  );
};

export default LoginPage;
