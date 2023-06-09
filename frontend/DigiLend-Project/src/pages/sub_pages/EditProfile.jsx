import React, { useEffect } from "react";

const EditProfile = () => {
  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const editPage = document.getElementById("editPage");
    editPage.style.width = `calc(100vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <div id="editPage" className="overflow-x-auto space-y-8">
      <div className="pt-8">
        <h1 className="font-Montserrat text-accent text-5xl font-bold">Edit Profile</h1>
      </div>
    </div>
  );
};

export default EditProfile;
