import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteReturn = ({ isVisible, onClose, deleteItem }) => {
  const [deleteData, setDeleteData] = useState({
    id_pengembalian: "",
    id_peminjaman: "",
    jumlah_dikembalikan: "",
    waktu_pengembalian: "",
    denda: "",
    ganti_rugi: "",
    total_sanksi: "",
    bukti_pembayaran: "",
  });

  useEffect(() => {
    if (deleteItem) {
      setDeleteData({
        id_pengembalian: deleteItem.id_pengembalian || "",
        id_peminjaman: deleteItem.id_peminjaman || "",
        jumlah_dikembalikan: deleteItem.jumlah_dikembalikan || "",
        waktu_pengembalian: deleteItem.waktu_pengembalian || "",
        denda: deleteItem.denda || "",
        ganti_rugi: deleteItem.ganti_rugi || "",
        total_sanksi: deleteItem.total_sanksi || "",
        bukti_pembayaran: deleteItem.bukti_pembayaran || "",
      });
    }
  }, [deleteItem]);

  const handleButtonClick = () => {
    axios
      .delete("/api/borrow", { data: deleteData })
      .then((response) => {
        // Menghandle respon sukses
        console.log(response.data);
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
          <h1 className="font-Montserrat text-3xl font-bold">Delete Return's Data</h1>
          <div className="text-white font-Montserrat space-y-4">
            <p className="font-semibold">Are you sure you want to delete the data with these details:</p>
            <div className="text-black space-y-4 bg-slate-300 p-4 shadow-inner">
              <div className="flex flex-row justify-between">
                <p>Return's ID: </p>
                <p>{deleteData.id_pengembalian}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Borrow's ID: </p>
                <p>{deleteData.id_peminjaman}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return Amount: </p>
                <p>{deleteData.jumlah_dikembalikan}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return Timestamp:</p>
                <p>{deleteData.waktu_pengembalian}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Penalty: </p>
                <p>{deleteData.denda}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Compensation: </p>
                <p>{deleteData.ganti_rugi}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Total Penalty: </p>
                <p>{deleteData.total_sanksi}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Proof of Payment: </p>
                <p>{deleteData.bukti_pembayaran}</p>
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

export default DeleteReturn;
