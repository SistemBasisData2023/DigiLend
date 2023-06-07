import React, { useState, useEffect } from "react";

const EditItem = ({ isVisible, onClose, selectedItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const userData = window.userData;

  useEffect(() => {
    if (selectedItem) {
      setItemName(selectedItem.name || "");
      setItemQuantity(selectedItem.quantity || "");
      setItemPrice(selectedItem.price || "");
    }
  }, [selectedItem]);

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-1/3 flex flex-col">
        <div className="flex flex-col bg-base-100 rounded-3xl items-center p-8 space-y-4">
          <h1 className="font-Montserrat text-3xl font-bold">Edit Item</h1>
          <div className="text-white space-y-4">
            <div className="space-y-2">
              <label className="text-lg">Item's Name</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Quantity</label>
              <input type="number" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-lg">Item's Price</label>
              <input type="text" placeholder="Type Here" className="input input-bordered input-accent w-full max-w-xs" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
            </div>
            <div className="flex flex-row justify-center items-center gap-8 pt-4">
              <button className="btn btn-error" onClick={() => onClose()}>
                Cancel
              </button>
              <button className="btn btn-success">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
