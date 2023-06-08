import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteItem = ({ isVisible, onClose, selectedItem }) => {
  const [deleteData, setDeleteData] = useState({
    itemName: "",
    itemQuantity: "",
    itemPrice: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setDeleteData({
        itemName: selectedItem.name || "",
        itemQuantity: selectedItem.quantity || "",
        itemPrice: selectedItem.price || "",
      });
    }
  }, [selectedItem]);

  console.log(deleteData);
  const handleButtonClick = () => {
    axios
      .delete(`/api/items/${selectedItem.id}`) // Replace '/api/items/${selectedItem.id}' with your actual API endpoint for deleting an item
      .then((response) => {
        console.log("Item deleted successfully:", response.data);
        // Handle any further actions after the item is deleted
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        // Handle any error that occurred during the deletion
      });
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Delete Item</h1>
          <div className="text-white space-y-4">
            <p className="font-semibold">Are you sure you want to delete the data with these details:</p>
            <div className="text-black space-y-4 bg-slate-300 p-4 shadow-inner">
              <div className="flex flex-row justify-between">
                <p>Item's Name: </p>
                <p>{deleteData.itemName}</p>
              </div>

              <div className="flex flex-row justify-between">
                <p>Quantity: </p>
                <p>{deleteData.itemQuantity}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Item's Price: </p>
                <p>{deleteData.itemPrice}</p>
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

export default DeleteItem;
