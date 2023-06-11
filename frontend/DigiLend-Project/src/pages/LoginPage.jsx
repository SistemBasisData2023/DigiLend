import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import digilendLogo from "../assets/logo-no-background.png";
import Background from "../components/background/background.jsx";
import loginVector from "../assets/login-vector.png";
import { BsConeStriped } from "react-icons/bs";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const [open, setOpen] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toggle = () => {
    setOpen(!open);
  };
  console.log(localStorage);

  const [inputError, setInputError] = useState({
    username: false,
    password: false,
  });

  const [eyeButtonError, setEyeButtonError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/login", formData)
      .then((response) => {
        const token = response.data.token;
        const akun = response.data.akun;
        localStorage.setItem("token", token);
        localStorage.setItem("akun", JSON.stringify(akun));
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        // Tangani kesalahan jika terjadi
        setInputError({
          username: true,
          password: true,
        });
        setEyeButtonError(true); // Set eyeButtonError menjadi true
        toast.error("Please check your username and password.", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
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
          <div className="my-5 space-y-2 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-info text-center font-Montserrat">Log In</h1>
            <div className="space-y-4 pt-3">
              <div className="flex flex-row justify-center">
                <img src={loginVector} alt="login-vector" className="h-36" />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={`input input-bordered input-info w-full max-w-xs bg-gray-50 placeholder:text-lg placeholder:sm:text-xl text-gray-900 font-Inter px-5 sm:px-8 sm:text-xl rounded-full ${inputError.username ? "input-error" : ""}`}
                  placeholder="Username"
                  required=""
                  value={formData.username}
                  onChange={handleChange}
                  onKeyUp={(e) => {
                    if (e.target.value !== "") {
                      setInputError((prevInputError) => ({
                        ...prevInputError,
                        username: false,
                      }));
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
                    className={`input input-bordered input-info w-full max-w-xs bg-gray-50 placeholder:text-lg placeholder:sm:text-xl text-gray-900 font-Inter px-5 sm:px-8 sm:text-xl rounded-full ${
                      inputError.password ? "input-error" : ""
                    }`}
                    required=""
                    value={formData.password}
                    onChange={handleChange}
                    onKeyUp={(e) => {
                      if (e.target.value !== "") {
                        setInputError((prevInputError) => ({
                          ...prevInputError,
                          password: false,
                        }));
                      }
                    }}
                  />

                  <button type="button" className={`text-3xl absolute bottom-[20%] right-[15%] ${eyeButtonError ? "text-error" : ""}`} onClick={toggle}>
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
                <button type="submit" className="p-2 px-7 hover:bg-info-content bg-info text-gray-50 font-Inter sm:text-lg w-fit h-fit rounded-2xl shadow-xl border-solid border-2" onClick={handleSubmit}>
                  LOGIN
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </motion.div>
  );
};

export default LoginPage;
