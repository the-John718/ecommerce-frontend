import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  Group,
  Card,
  Tooltip,
  Button,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import img2 from "../Images/product-pot-image-3.webp";
import { IconEye, IconHeart, IconShoppingCart } from "@tabler/icons-react";
import { CardContext } from "../Context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const handleAddToCart = async (product) => {
  try {
    const token = localStorage.getItem("Authorization");

    // Sanity check
    if (!token) {
      toast.error("User not logged in!");
      return;
    }

    if (!product || !product._id || !product.price) {
      toast.error("Invalid product data");
      return;
    }

    const quantity = 1;
    const totalPrice = product.price * quantity;

    const payload = {
      productId: product._id,
      name: product.name,
      brand: product.Brand,
      category: product.category,
      price: product.price,
      image: product.images[0],
      quantity,
      totalPrice,
    };

    console.log("🔼 Sending to API:", payload);

    const response = await fetch(
      "https://ecommerce-backend-rvai.onrender.com/cart/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("🔽 Response from API:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to add to cart");
    }

    toast.success("✅ Product added to cart!");
  } catch (error) {
    toast.error("❌ " + (error.message || "Add to cart failed"));
  }
};

const Cardshow = ({ card }) => {
  const { cardData, filterData } = useContext(CardContext);
  const [cart, setCart] = useState([]);
  const [hovered, setHovered] = useState(false);
  // console.log("card : ", cart);
  const [quickOpened, { open: openQuick, close: closeQuick }] =
    useDisclosure(false);

  useEffect(() => {
    console.log("it is the end", cardData);
    if (cardData.length > 0) {
      const newProducts = cardData.filter((p, i, self) => {
        return i === self.findIndex((item) => item.name === p.name);
      });
      console.log("filtered : ", card);
      setCart(newProducts);
    }
  }, [cardData]);

  return (
    <Box
      color="#E9E3D7"
      w="100%"
      display="flex"
      justify="center"
      align="center"
      style={{ alignItems: "center" }}
      ml={"40%"}
    >
      <Card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        padding="lg"
        radius="md"
        style={{
          width: 290,
          height: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          // transition: "box-shadow 0.3s ease",
          backgroundColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(4px)",
          // boxShadow: hovered
          //   ? "0 4px 20px rgba(0,0,0,0.25)"
          //   : "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* ── Image box (position: relative) ── */}
        <Box
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            width: "100%",
            height: 210,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {/* Zoom‑in effect */}
          <Image
            src={card.images}
            width="100%"
            height="100%"
            fit="cover"
            radius={"5px"}
            style={{
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.1)" : "scale(1)",
            }}
          />

          {/* Sliding overlay */}
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "25%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              transform: hovered ? "translateY(0)" : "translateY(100%)",
              opacity: hovered ? 1 : 0,
              transition: "transform 0.35s ease, opacity 0.45s ease",
              // background:
              //   "linear-gradient(to top, rgba(0,0,0,0.6), rgba(255, 253, 253, 0.45))",
            }}
          >
            <Box
              className="hover-box"
              bg={"white"}
              h={"90%"}
              w={"90%"}
              display={"flex"}
              style={{
                justifyContent: "space-around",
                borderRadius: "4px",
                alignItems: "center",
              }}
            >
              <Group ml={"0%"} mb={"1%"} p={"5px"} gap={"19px"}>
                <Tooltip label="Add to Cart" position="top" withArrow>
                  <ActionIcon
                    variant="transparent"
                    color="orange"
                    radius="xl"
                    size="lg"
                    onClick={() => handleAddToCart(card)}
                  >
                    <IconShoppingCart size={24} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Add to Wishlist" position="top" withArrow>
                  <ActionIcon
                    variant="transparent"
                    color="black"
                    radius="xl"
                    size="lg"
                  >
                    <IconHeart size={24} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Quick View" position="top" withArrow>
                  <ActionIcon
                    variant="transparent"
                    color="black"
                    radius="xl"
                    size="lg"
                    onClick={openQuick}
                  >
                    <IconEye size={24} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Box>
          </Box>
        </Box>

        {/* ── Card text info ── */}
        <Group position="apart" mt="md" mb="xs">
          <Box>
            <Text weight={600} size="lg" ta={"start"}>
              {card.category}
            </Text>
            <Text weight={700} size="md" lineClamp={1} ta={"start"}>
              {card.name}
            </Text>
          </Box>
        </Group>

        <Text size="md" color="dimmed" mb="sm" mr={"100%"}>
          ${card.price}
        </Text>
      </Card>
      <Modal
        opened={quickOpened}
        onClose={closeQuick}
        title="Product Quick View"
        size="lg"
        centered
        zIndex={2000}
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
      >
        <Box
          p="md"
          // bg="white"
          style={{
            borderRadius: "16px",
            // border:" 2px solid black",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            maxWidth: 700,
            // margin: "0 auto",
          }}
        >
          {/* Product Image */}
          <Box
            mb="md"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={card.images}
              radius="md"
              fit="contain"
              width={210}
              height={210}
              style={{
                objectFit: "contain",
                border: "1px solid white",
                borderRadius: "12px",
                padding: "8px",
                backgroundColor: "#f9f9f9",
              }}
            />
          </Box>

          {/* Title */}
          <Text weight={600} size="md" color="dimmed">
            Name
          </Text>
          <Text weight={700} size="lg" mb="sm">
            {card.name}
          </Text>

          {/* Brand & Category Row */}
          <Box style={{ display: "flex", gap: "20px", marginBottom: "12px" }}>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Brand
              </Text>
              <Text weight={700}>{card.brand}</Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Category
              </Text>
              <Text>{card.category}</Text>
            </Box>
          </Box>

          {/* Description */}
          <Text weight={600} size="md" color="dimmed">
            Description
          </Text>
          <Text mb="sm">{card.description}</Text>

          {/* Price & Qty Row */}
          <Box style={{ display: "flex", gap: "20px" }}>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Price
              </Text>
              <Text>${card.price}</Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Qty
              </Text>
              <Text>{card.stockAmount || 1}</Text>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Cardshow;
