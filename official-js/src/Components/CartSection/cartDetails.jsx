import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Box, Stepper, Text, Button, TextInput } from "@mantine/core";
import toast, { Toaster } from 'react-hot-toast';
import {
  IconUserCheck,
  IconMailOpened,
  IconShieldCheck,
  IconCircleCheck,
  IconChevronRight,
} from "@tabler/icons-react";
import axios from "axios";
import Cartdesign from "./Cartdesign";

const Cartdetails = () => {
  const [active, setActive] = useState(0); // start from Cart (0)
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [cart, setCart] = useState([]);
  const [cartMap, setCartMap] = useState(new Map());

  const getData = async () => {
    try {
      const token = localStorage.getItem("Authorization");

      if (!token) {
        console.warn("⚠️ No token found in localStorage.");
        return;
      }

      const { cartItems } = await axios
        .get("https://ecommerce-backend-rvai.onrender.com/cart/getproducts", {
          headers: {
            Authorization: token,
          },
        })
        .then((data) => data.data);

      console.log("response : ", cartItems);

      const products = cartItems;
      const map = new Map();

      products.forEach((product) => {
        map.set(product._id, product);
      });

      setCartMap(map);

      let total = 0;
      map.forEach((item) => {
        total += item.quantity * item.productId.price;
      });
      setTotalAmount(total);
      console.log("✅ Cart Map:", map);
    } catch (error) {
      console.error("❌ Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleBoxScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount((prev) => prev + 10); // load 10 more cards
    }
  };
  useEffect(() => {
    const qtyObj = {};
    for (const [id, item] of cartMap.entries()) {
      qtyObj[id] = item.quantity;
    }
    setQuantities(qtyObj);
  }, [cartMap]);

  const handleQuantityChange = (id, newQty, price) => {
    if (newQty < 1) return;
    setQuantities((prev) => {
      const updated = { ...prev, [id]: newQty };

      // Recalculate total after update
      let newTotal = 0;
      for (const key in updated) {
        const item = cartMap.get(key);
        if (item) {
          newTotal += updated[key] * item.productId.price;
        }
      }

      setTotalAmount(newTotal);
      return updated;
    });
  };
  const totalQuantity = Object.values(quantities).reduce(
    (sum, q) => sum + q,
    0
  );

  const handleRemoveItem = (id) => {
    const updatedMap = new Map(cartMap);
    updatedMap.delete(id);
    setCartMap(updatedMap);

    const updatedQuantities = { ...quantities };
    delete updatedQuantities[id];
    setQuantities(updatedQuantities);

    // Recalculate total
    let newTotal = 0;
    for (const [key, item] of updatedMap.entries()) {
      newTotal += (updatedQuantities[key] || 1) * item.productId.price;
    }
    setTotalAmount(newTotal);

    // Toast and log
    toast.success("🗑️ Item removed from cart");
    console.log("✅ Item removed from cart");

    // Optional: Backend delete
    axios
      .delete(`https://ecommerce-backend-rvai.onrender.com/cart/remove/${id}`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .catch((err) => {
        console.error("❌ Failed to delete from backend:", err);
        toast.error("Failed to sync with server");
      });
  };

  return (
    <>
    <Toaster position="top-right" />

      <Box
        className="main-section"
        h={"100vh"}
        w={"100vw"}
        // bg={"gray"}
        display={"flex"}
        style={{ flexDirection: "column", gap: "4%" }}
      >
        {/* Navbar */}
        <Box className="nav-section" h={"10%"} w={"100vw"}>
          <Navbar />
        </Box>

        {/* Stepper */}
        <Box
          className="stepper-section"
          h={"10%"}
          w={"40vw"}
          bg={"white"}
          mx="auto"
          mt="sm"
        >
          <Stepper
            size="xs"
            active={active}
            onStepClick={setActive}
            completedIcon={<IconCircleCheck size={14} />}
            styles={{
              separator: { width: 20 },
              stepIcon: { width: 28, height: 28 },
              stepBody: { marginTop: 2 },
            }}
          >
            <Stepper.Step
              icon={<IconUserCheck size={19} />}
              label={
                <Text size="xs" fw={500} ta="center">
                  Cart
                </Text>
              }
              description="Items"
            />
            <Stepper.Step
              icon={<IconMailOpened size={19} />}
              label={
                <Text size="xs" fw={500} ta="center">
                  Address
                </Text>
              }
              description="Details"
            />
            <Stepper.Step
              icon={<IconShieldCheck size={19} />}
              label={
                <Text size="xs" fw={500} ta="center">
                  Payment
                </Text>
              }
              description="Secure"
            />
          </Stepper>
        </Box>

        {/* STEP CONTENTS */}
        <Box
          className="display section"
          h={"80%"}
          w={"100%"}
          // bg={"white"}
          display={"flex"}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap:"5%"
          }}
        >
          {active === 0 && (
            <>
              {/* Step 1 - Cart */}
              <Box
                className="cart-display"
                w={"45%"}
                // bg={"white"}
                ml={"3%"}
                p="md"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: "8px",
                  gap: "16px",
                  height: "90%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  boxShadow:"2px 1px 1px 1px black"
                }}
                onScroll={handleBoxScroll}
              >
                {[...cartMap.values()].slice(0, visibleCount).map((item) => (
                  <Cartdesign
                    key={item._id}
                    item={item}
                    quantity={quantities[item._id] || 1}
                    onQuantityChange={(newQty) =>
                      handleQuantityChange(
                        item._id,
                        newQty,
                        item.productId.price
                      )
                    }
                    onRemove={() => handleRemoveItem(item._id)}
                  />
                ))}
              </Box>

              <Box
                className="cart-price-section"
                h={"90%"}
                w={"30%"}
                mr={"5%"}
                // bg={"pink"}
                display={"flex"}
                style={{
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: "8px",
                  gap: "5%",
                  padding: "4%",
                }}
              >
                <Text ta="left" style={{ fontSize: "22px" }}>
                  Price Details
                </Text>
                <Box
                  w={"100%"}
                  mt={"7%"}
                  h={"50%"}
                  // bg={"blue"}
                  display={"flex"}
                  style={{
                    gap: "15px",
                    border: "2px solid black",
                    borderRadius: "8px",
                    flexDirection: "column",
                  }}
                >
                  <Box w={"100%"} h={"20%"}>
                    <Text ml={"3%"} style={{ fontSize: "17px" }}>
                      {" "}
                      quantity = {totalQuantity}
                    </Text>
                  </Box>

                  <Box
                    w={"100%"}
                    h={"20%"}
                    // bg={"lime"}
                    display={"flex"}
                    style={{ flexDirection: "row" }}
                  >
                    <Box w={"50%"} h={"100%"} >
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        {totalQuantity}x price
                      </Text>
                    </Box>
                    <Box w={"50%"} h={"100%"} >
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        {totalAmount}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    h={"20%"}
                    // bg={"lime"}
                    display={"flex"}
                    style={{
                      flexDirection: "row",
                      borderBottom: "2px solid black",
                    }}
                  >
                    <Box w={"50%"} h={"100%"}>
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        Delivery charges =
                      </Text>
                    </Box>
                    <Box w={"50%"} h={"100%"} >
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        Free - Delivery
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    w={"100%"}
                    h={"20%"}
                    // bg={"lime"}
                    display={"flex"}
                    style={{ flexDirection: "row" }}
                  >
                    <Box w={"50%"} h={"100%"}>
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        Totall Amount =
                      </Text>
                    </Box>
                    <Box w={"50%"} h={"100%"}>
                      <Text ml={"3%"} style={{ fontSize: "19px" }}>
                        ₹ {totalAmount}
                      </Text>
                    </Box>
                  </Box>
                </Box>
                <Box
                  w={"100%"}
                  display={"flex"}
                  h={"25%"}
                  // bg={"grape"}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Button
                    w={"60%"}
                    style={{ border: "2px solid black" }}
                    onClick={() => setActive(1)}
                  >
                    <Text
                      style={{
                        fontFamily: "Bebas Neue, sans-serif",
                        fontSize: "24px",
                        color: "black",
                      }}
                    >
                      {" "}
                      Place order{" "}
                    </Text>
                    <IconChevronRight size={29} color="black" />
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {active === 1 && (
            <>
              <Box
                w="60%"
                h="80%"
                bg="lightgray"
                p="xl"
                style={{
                  border: "2px solid black",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Text size="xl" fw={600}>
                  🏠 Address Details
                </Text>
                <Box
                  w={"100%"}
                  h={"20%"}
                  bg={"blue"}
                  display={"flex"}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextInput
                    w={"30%"}
                    label="Full Name"
                    placeholder="John Doe"
                  />
                  <TextInput
                    w={"30%"}
                    label="Street Address"
                    placeholder="123 Street, City"
                  />
                </Box>

                <Box
                  w={"100%"}
                  h={"20%"}
                  bg={"blue"}
                  display={"flex"}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextInput w={"30%"} label="Pincode" placeholder="123456" />
                  <TextInput w={"30%"} label="City" placeholder="City" />
                </Box>
                <Box
                  w={"100%"}
                  h={"20%"}
                  bg={"blue"}
                  display={"flex"}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TextInput w={"30%"} label="Pincode" placeholder="123456" />
                  <TextInput w={"30%"} label="City" placeholder="City" />
                </Box>

                <Box mt="md" display="flex" style={{ gap: "10px" }}>
                  <Button variant="default" onClick={() => setActive(0)}>
                    Back
                  </Button>
                  <Button color="blue" onClick={() => setActive(2)}>
                    Next
                  </Button>
                </Box>
              </Box>
            </>
          )}

          {active === 2 && (
            <Box>
              <Text size="xl" fw={600}>
                💳 Payment Page (Step 3)
              </Text>
              <Button mt="md" onClick={() => setActive(1)}>
                Back
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Cartdetails;
