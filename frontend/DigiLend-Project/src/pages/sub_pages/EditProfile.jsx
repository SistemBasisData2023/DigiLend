import React, { useEffect } from "react";

import profileImage from "../../assets/edit-profile-big.png";

const EditProfile = () => {
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
          <div className="flex flex-col space-x-10">
            <div>
              <p>Nama</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
