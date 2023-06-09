import React, { useState, useEffect } from "react";
import axios from "axios";

const EditItem = ({ isVisible, onClose, selectedItem }) => {
  const userData = window.userData;
  const [editData, setEditData] = useState({
    itemName: "",
    itemQuantity: "",
    itemPrice: "",
  });

  useEffect(() => {
    if (selectedItem) {
      setEditData({
        itemName: selectedItem.name || "",
        itemQuantity: selectedItem.quantity || "",
        itemPrice: selectedItem.price || "",
      });
    }
  }, [selectedItem]);

  const handleButtonClick = () => {
    axios
      .put(`http://localhost:3000/barang/${selectedItem.id}`, editData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        // Handle any further actions after the data is updated
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        // Handle any error that occurred during the update
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
              <label className="text-lg">Item's Name</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={editData.itemName} onChange={(e) => setEditData({ ...editData, itemName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Quantity</label>
              <input type="number" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={editData.itemQuantity} onChange={(e) => setEditData({ ...editData, itemQuantity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Price</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={editData.itemPrice} onChange={(e) => setEditData({ ...editData, itemPrice: e.target.value })} />
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
    </div>
  );
};

export default EditItem;
