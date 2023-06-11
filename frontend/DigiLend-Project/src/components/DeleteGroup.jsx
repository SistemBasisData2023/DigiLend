import React from "react";
import axios from "axios";

const DeleteGroup = ({ isVisible, onClose, selectedGroup }) => {
  const handleButtonClick = () => {
    axios
      .delete(`http://localhost:3000/kelompok/${selectedGroup.id_kelompok}`, { data: selectedGroup })
      .then((response) => {
        // Menghandle respon sukses
        console.log(response.data);
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        // Menghandle kesalahan
        console.error(error);
      });
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="md:w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Delete Group</h1>
          <div className="text-white space-y-4">
            <p className="font-semibold">Are you sure you want to delete the data with these details:</p>
            <div className="text-black space-y-4 bg-slate-300 p-4 shadow-inner">
              <div className="flex flex-row justify-between">
                <p>Group's ID: </p>
                <p>{selectedGroup.id_kelompok}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Group's Name: </p>
                <p>{selectedGroup.nama_kelompok}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Lab Assistant: </p>
                <p>{selectedGroup.asisten_pendamping}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Semester: </p>
                <p>{selectedGroup.semester}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Academic Year: </p>
                <p>{selectedGroup.tahun_ajaran}</p>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-8 pt-4">
              <button className="btn btn-error" onClick={() => onClose()}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleButtonClick}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroup;
