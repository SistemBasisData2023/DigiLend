import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteReturn = ({ isVisible, onClose, deleteItem }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }
  const handleButtonClick = () => {
    axios
      .delete(`http://localhost:3000/pengembalian/${deleteItem.id_pengembalian}`)
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
          <h1 className="font-Montserrat text-3xl font-bold">Delete Return's Data</h1>
          <div className="text-white font-Montserrat space-y-4">
            <p className="font-semibold">Are you sure you want to delete the data with these details:</p>
            <div className="text-black space-y-4 bg-slate-300 p-4 shadow-inner">
              <div className="flex flex-row justify-between">
                <p>Return's ID: </p>
                <p>{deleteItem.id_pengembalian}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Borrow's ID: </p>
                <p>{deleteItem.id_peminjaman}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return Amount: </p>
                <p>{deleteItem.jumlah_dikembalikan}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return Timestamp:</p>
                <p>{formatDate(deleteItem.waktu_pengembalian)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Penalty: </p>
                <p>{deleteItem.denda}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Compensation: </p>
                <p>{deleteItem.ganti_rugi}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Total Penalty: </p>
                <p>{deleteItem.total_sanksi}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Proof of Payment: </p>
                <p>{deleteItem.bukti_pembayaran}</p>
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
