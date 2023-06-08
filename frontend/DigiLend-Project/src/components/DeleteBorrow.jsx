import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteBorrow = ({ isVisible, onClose, deleteItem }) => {
  const [deleteData, setDeleteData] = useState({
    borrowerID: "",
    itemID: "",
    itemQuantity: "",
    PracticianID: "",
    borrowDeadline: "",
  });

  useEffect(() => {
    if (deleteItem) {
      setDeleteData({
        borrowerID: deleteItem.id_peminjaman || "",
        itemID: deleteItem.id_barang || "",
        itemQuantity: deleteItem.jumlah_dipinjam || "",
        PracticianID: deleteItem.id_praktikan || "",
        borrowDeadline: deleteItem.tenggat_waktu || "",
      });
    }
  }, [deleteItem]);

  const handleButtonClick = () => {
    axios
      .put("/api/delete", deleteData) // Replace '/api/delete' with your actual API endpoint
      .then((response) => {
        console.log("Data deleted successfully:", response.data);
        // Handle any further actions after the data is deleted
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
        // Handle any error that occurred during the deletion
      });
  };
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Delete Item</h1>
          <div className="text-white font-Montserrat space-y-4">
            <p className="font-semibold">Are you sure you want to delete the data with these details:</p>
            <div className="text-black space-y-4 bg-slate-300 p-4 shadow-inner">
              <div className="flex flex-row justify-between">
                <p>Borrower's ID: </p>
                <p>{deleteData.borrowerID}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Item's ID: </p>
                <p>{deleteData.itemID}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Quantity: </p>
                <p>{deleteData.itemQuantity}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Practician's ID: </p>
                <p>{deleteData.PracticianID}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return's Deadline: </p>
                <p>{deleteData.borrowDeadline}</p>
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

export default DeleteBorrow;
