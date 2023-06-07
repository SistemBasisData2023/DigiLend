import React, { useState, useEffect } from "react";

const DeleteBorrow = ({ isVisible, onClose, deleteItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const userData = window.userData;

  useEffect(() => {
    if (deleteItem) {
      setItemName(deleteItem.name || "");
      setItemQuantity(deleteItem.quantity || "");
      setItemPrice(deleteItem.price || "");
    }
  }, [deleteItem]);

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
                <p>Borrow's ID: </p>
                <p>{deleteItem.id_peminjaman}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Item's ID: </p>
                <p>{deleteItem.id_barang}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Quantity: </p>
                <p>{deleteItem.jumlah_dipinjam}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Practician's ID: </p>
                <p>{deleteItem.id_praktikan}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Return's Deadline: </p>
                <p>{deleteItem.tenggat_waktu}</p>
              </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-8 pt-4">
              <button className="btn btn-error" onClick={() => onClose()}>
                Cancel
              </button>
              <button className="btn btn-success">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBorrow;
