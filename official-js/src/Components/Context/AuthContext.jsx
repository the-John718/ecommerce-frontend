import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CardContext = createContext();

export const CardProvider = ({ children }) => {
  const [cardData, setCardData] = useState([]);
  const [productData, setProductData] = useState([]);

  const getData = async () => {
    try {
      const data = await axios
        .get("https://ecommerce-backend-rvai.onrender.com/admin/product")
        .then((res) => res.data.products);

      setCardData(data);
    } catch (err) {
      console.error("API fetch failed:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setProductData(cardData);
    // console.log("📦 cardData updated:", cardData);
  }, [cardData]);

  return (
    <CardContext.Provider value={{ cardData, productData, setProductData }}>
      {children}
    </CardContext.Provider>
  );
};
