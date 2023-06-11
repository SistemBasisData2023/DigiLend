import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddItem = ({ isVisible, onClose }) => {
  const [addData, setAddData] = useState({
    nama_barang: "",
    jumlah_tersedia: "",
    harga: "",
  });
  console.log(addData);

  const handleButtonClick = () => {
    axios
      .post("http://localhost:3000/barang", addData) // Mengirimkan addData sebagai body permintaan
      .then((response) => {
        console.log("Data berhasil ditambahkan:", response.data);
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Kesalahan saat menambahkan data:", error);
        toast.error("An error occurred while adding new item", {
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
          <h1 className="font-Montserrat text-3xl font-bold">Add Item</h1>
          <div className="text-white space-y-4">
            <div className="space-y-2">
              <label className="text-lg">Item's Name</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.nama_barang} onChange={(e) => setAddData({ ...addData, nama_barang: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Quantity</label>
              <input type="number" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.jumlah_tersedia} onChange={(e) => setAddData({ ...addData, jumlah_tersedia: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Price</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.harga} onChange={(e) => setAddData({ ...addData, harga: e.target.value })} />
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

export default AddItem;
