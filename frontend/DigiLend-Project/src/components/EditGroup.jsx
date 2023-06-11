import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditGroup = ({ isVisible, onClose, selectedGroup }) => {
  const [editData, setEditData] = useState({
    nama_kelompok: "",
    kode_aslab: "",
  });
  console.log(editData);
  useEffect(() => {
    if (selectedGroup) {
      setEditData({
        nama_kelompok: selectedGroup.nama_kelompok || "",
        kode_aslab: selectedGroup.kode_aslab || "",
      });
    }
  }, [selectedGroup]);

  const handleButtonClick = () => {
    axios
      .put(`http://localhost:3000/kelompok/${selectedGroup.id_kelompok}`, editData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        toast.error("An error occurred while updating the item", {
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

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="md:w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Edit Item</h1>
          <div className="text-white space-y-4">
            <div className="space-y-2">
              <label className="text-lg">Group's Name</label>
              <input
                type="text"
                placeholder="Type Here"
                className="input input-bordered input-accent w-full max-w-xs"
                value={editData.nama_kelompok}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (/^[BKE0-9]*$/i.test(inputValue)) {
                    setEditData({ ...editData, nama_kelompok: inputValue });
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Aslab Code</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={editData.kode_aslab} onChange={(e) => setEditData({ ...editData, kode_aslab: e.target.value })} />
            </div>
            <div className="flex flex-row justify-center items-center gap-8 pt-4">
              <button className="btn btn-error" onClick={() => onClose()}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleButtonClick}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
};

export default EditGroup;
