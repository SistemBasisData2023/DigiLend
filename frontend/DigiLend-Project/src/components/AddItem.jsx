import React, { useState, useEffect } from "react";
import axios from "axios";

const AddItem = ({ isVisible, onClose }) => {
  const userData = window.userData;
  const [addData, setAddData] = useState({
    itemName: "",
    itemQuantity: "",
    itemPrice: "",
  });
  console.log(addData);

  const handleButtonClick = () => {
    axios
      .post("/api/create", newItem) // Replace '/api/create' with your actual API endpoint
      .then((response) => {
        console.log("Data created successfully:", response.data);
        // Handle any further actions after the data is created
      })
      .catch((error) => {
        console.error("Error creating data:", error);
        // Handle any error that occurred during the creation
      });
  };

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Add Item</h1>
          <div className="text-white space-y-4">
            <div className="space-y-2">
              <label className="text-lg">Item's Name</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.itemName} onChange={(e) => setAddData({ ...addData, itemName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Quantity</label>
              <input type="number" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.itemQuantity} onChange={(e) => setAddData({ ...addData, itemQuantity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Price</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={addData.itemPrice} onChange={(e) => setAddData({ ...addData, itemPrice: e.target.value })} />
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

export default AddItem;
