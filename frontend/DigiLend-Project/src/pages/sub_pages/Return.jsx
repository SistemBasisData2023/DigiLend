import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Return = () => {
  const userData = window.userData;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get("id");
  const [borrowed, setBorrowed] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`);
    setBorrowed(data);
    console.log(data);
  };

  const selectedItem = borrowed.find((item) => item.id === parseInt(itemId));

  console.log(selectedItem);
  const [formData, setFormData] = useState({
    id_barang: selectedItem ? selectedItem.id : "",
    name: selectedItem ? selectedItem.id : "",
    jumlah_dipinjam: "",
    id_praktikan: 0,
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: selectedItem.id,
        name: selectedItem.name,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_barang: "",
        name: "",
      }));
    }
  }, [selectedItem]);
  return <div>Return</div>;
};

export default Return;
