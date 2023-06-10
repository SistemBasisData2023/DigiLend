import React, { useState, useEffect } from "react";
import axios from "axios";

import profileImage from "../../assets/edit-profile-big.png";

const EditProfile = () => {
  const userData = JSON.parse(localStorage.getItem("akun"));
  const [profileData, setProfileData] = useState({
    nama: userData.nama,
    npm: userData.npm,
    telepon: userData.telepon,
    jurusan: userData.jurusan,
    nama_kelompok: "",
    kode_aslab: "",
    status_aslab: "",
    tahun_ajaran: "",
  });
  console.log("profile:", profileData);

  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const editPage = document.getElementById("editPage");
    editPage.style.width = `calc(100vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <div id="editPage" className="overflow-x-auto space-y-8">
      <div className="pt-8">
        <h1 className="font-Montserrat text-accent text-3xl font-bold">Edit Profile</h1>
        <div className="m-12 bg-[#2d314c] flex flex-row">
          <img src={profileImage} alt="Edit Profile" className="h-96 m-12 bg-slate-600 rounded-[4rem]" />
          <div className="m-12 flex flex-col space-y-10">
            <div>
              <p>Nama:</p>
              <p>{userData.nama}</p>
            </div>
            <div>
              <p>NPM:</p>
              <p>{userData.npm}</p>
            </div>
            <div>
              <p>Telepon:</p>
              <p>{userData.telepon}</p>
            </div>
            <div>
              <p>Nama Kelompok:</p>
              <p>{userData.nama_kelompok}</p>
            </div>
            <div>
              <p>Kode Aslab:</p>
              <p>{userData.kode_aslab}</p>
            </div>
            <div>
              <p>Status Aslab:</p>
              <p>{userData.kode_aslab}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
