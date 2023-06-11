import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BsFillPencilFill } from "react-icons/bs";

import profileImage from "../../assets/edit-profile-big.png";

const EditProfile = () => {
  const userData = JSON.parse(localStorage.getItem("akun"));
  const [data, setData] = useState({
    nama_kelompok: "",
    kode_aslab: "",
    status_aslab: "",
  });
  const [profileData, setProfileData] = useState({
    nama: userData.nama,
    npm: userData.npm,
    telepon: userData.telepon,
    jurusan: userData.jurusan,
    nama_kelompok: "",
    kode_aslab: "",
    status_aslab: "active",
    tahun_ajaran: "",
  });
  console.log("profile:", profileData);

  useEffect(() => {
    getData();
    getAsistenData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/kelompok/${userData.id_akun}`);
      setData((prevData) => ({
        ...prevData,
        nama_kelompok: response.data.nama_kelompok,
      }));
      console.log("profile:", data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data:", error);
    }
  };

  const getAsistenData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/kode_aslab/${userData.id_akun}`);
      setData((prevData) => ({
        ...prevData,
        kode_aslab: response.data.kode_aslab,
        status_aslab: response.data.status_aslab,
      }));
      console.log("kode:", response.data);
    } catch (error) {
      console.error("Kesalahan saat mengambil kode aslab:", error);
    }
  };

  const [groupList, setGroupList] = useState([]);

  useEffect(() => {
    const getGroupData = async () => {
      try {
        if (profileData.tahun_ajaran) {
          const response = await axios.get(`http://localhost:3000/nama_kelompok/${profileData.tahun_ajaran}`);
          const data = response.data;
          setGroupList(data);
        }
      } catch (error) {
        console.error("Kesalahan saat mengambil data kelompok:", error);
      }
    };

    getGroupData();
  }, [profileData.tahun_ajaran]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevProfileData) => ({
      ...prevProfileData,
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

  const [tahunAjaran, setTahunAjaran] = useState([]);

  useEffect(() => {
    getTahunAjaranData();
  }, []);

  const getTahunAjaranData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tahun_ajaran");
      const data = response.data;
      setTahunAjaran(data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data tahun ajaran:", error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/akun/${userData.id_akun}`, profileData);
      console.log("Data akun berhasil diperbarui:", response.data);
      const akun = response.data.akunAfterEditData;
      localStorage.setItem("akun", JSON.stringify(akun));
      getData(); // Panggil getData setelah berhasil memperbarui data akun
      getAsistenData();

      setIsEditing(false); // Kembali ke tampilan profil setelah berhasil memperbarui data akun
      // Lakukan tindakan lain setelah berhasil memperbarui data akun
    } catch (error) {
      console.error("Kesalahan saat memperbarui data akun:", error);
      // Lakukan tindakan lain jika terjadi kesalahan saat memperbarui data akun
      toast.error("Please fill all the required form!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    const navbarHeight = document.getElementById("navbar").offsetHeight;
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const editPage = document.getElementById("editPage");
    editPage.style.width = `calc(100vw - ${sidebarWidth}px)`;
    editPage.style.height = `calc(100vh - ${navbarHeight}px)`;
  }, []);
  return (
    <div id="editPage" className="overflow-x-auto space-y-8">
      <div className="pt-6 pl-5 flex flex-col items-center">
        <h1 className="font-Montserrat text-accent sm:text-5xl text-3xl text-center font-bold">Edit Profile</h1>
        <div className="flex md:flex-row flex-col md:justify-center m-8 font-Montserrat items-center h-auto w-10/12">
          <img src={profileImage} alt="Edit Profile" className="sm:h-56 md:h-96 m-12 bg-slate-600 rounded-[4rem]" />
          {isEditing ? (
            <div className="flex flex-col space-y-4 text-white h-96 sm:w-96 md:w-fit">
              <div className="md:mx-12 pl-20 md:pl-0 m-4 flex flex-col space-y-2 md:space-y-4 text-white">
                <div className="flex flex-row gap-4 items-center">
                  <span className="w-48">Name</span>
                  <input type="text" name="nama" value={profileData.nama} onChange={handleChange} className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <span className="w-48">Student ID</span>
                  <input type="text" name="npm" value={profileData.npm} onChange={handleStudentIdChange} className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <span className="w-48">Telephone Number</span>
                  <input type="text" name="telepon" value={profileData.telepon} onChange={handlePhoneNumberChange} className="input input-bordered w-full max-w-xs" />
                </div>
                {userData.id_role === 1 ? (
                  <div>
                    <div className="flex flex-row gap-4 items-center">
                      <span className="w-48">Asistant Code</span>
                      <input type="text" name="kode_aslab" value={profileData.kode_aslab} onChange={handleChange} className="input input-bordered w-full max-w-xs" />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                      <span className="w-48">Asistant Status</span>
                      <select name="status_aslab" value={profileData.status_aslab} onChange={handleChange} className="select select-bordered md:w-full max-w-xs">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:space-y-2 md:space-y-4">
                    <div className="flex flex-row gap-4 items-center justify-between">
                      <span className="w-48">Academic Year</span>
                      <select name="tahun_ajaran" value={profileData.tahun_ajaran} onChange={handleChange} className="select select-bordered md:w-full max-w-xs">
                        {tahunAjaran.map((getTahunAjaranData) => (
                          <option key={getTahunAjaranData}>{getTahunAjaranData}</option>
                        ))}
                      </select>
                    </div>

                    {profileData.tahun_ajaran && (
                      <div className="flex flex-row gap-4 items-center justify-between">
                        <span className="w-48">Group Name</span>
                        <select name="nama_kelompok" value={profileData.nama_kelompok} onChange={handleChange} className="select select-bordered md:w-full max-w-xs">
                          {groupList.map((groupData) => (
                            <option key={groupData}>{groupData}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-row md:gap-4 gap-2 pt-2 md:pt-4 justify-center">
                  <button className="btn btn-info md:h-16 w-32 md:w-56" onClick={handleSaveProfile}>
                    save
                  </button>
                  <button className="btn btn-outline btn-info w-32 md:h-16 md:w-56" onClick={handleCancelEdit}>
                    cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 text-white h-96 md:text-left text-center">
              <div className="mx-12 m-4 flex flex-col space-y-4 text-white w-[464px]">
                <div className="space-y-2">
                  <p className="font-bold ">Name:</p>
                  <p className=" text-[#b8c1f6] ">{userData.nama}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold ">Student ID:</p>
                  <p className=" text-[#b8c1f6] ">{userData.npm}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold ">Telephone Number:</p>
                  <p className=" text-[#b8c1f6] ">{userData.telepon}</p>
                </div>

                {userData.id_role === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-bold ">Asistant Code:</p>
                      <p className=" text-[#b8c1f6] ">{data.kode_aslab}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold ">Asistant Status :</p>
                      <p className=" text-[#b8c1f6] ">{data.status_aslab}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-bold ">Group Name:</p>
                    <p className=" text-[#b8c1f6] ">{data.nama_kelompok}</p>
                  </div>
                )}
                <div className="pt-3 flex flex-row justify-center sm:justify-start">
                  <button className="flex flex-row items-center btn btn-outline btn-info h-16 w-56 gap-5" onClick={handleEditProfile}>
                    <BsFillPencilFill />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
};

export default EditProfile;
