import { Box, Text, Image, ActionIcon } from "@mantine/core";
import React from "react";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

const Cartdesign = ({ item, quantity, onQuantityChange,onRemove }) => {
  const totalPrice = quantity * item.productId.price;

  return (
    <Box
      className="cart-body"
      display={"flex"}
      h={165}
      w={"100%"}
      bg={"white"}
      style={{
        flexDirection: "row",
        boxShadow: "0px 0px 1px 1px gray",
        borderRadius: "8px",
        padding: "7px",
      }}
    >
      {/* IMAGE SECTION */}
      <Box
        className="image-section"
        h={125}
        w={"25%"}
        mt={"1%"}
        ml={"5px"}
        style={{
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          boxShadow: "1px 1px 1px gray",
          justifyContent: "center",
        }}
      >
        <Image src={item.productId.images} width="100%" height="100%" />
      </Box>

      {/* PRODUCT NAME AND PRICE */}
      <Box
        className="product-name-box"
        w={"35%"}
        h={"100%"}
        p="md"
        display={"flex"}
        style={{
          flexDirection: "column",
          borderRadius: 8,
          gap: "7px",
        }}
      >
        <Text
          weight={800}
          size="19px"
          ta={"center"}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
          }}
        >
          {item.productId.name}
        </Text>
        <Text weight={800} size="19px" ta={"center"}>
          ₹ {item.productId.price}
        </Text>
      </Box>

      {/* BRAND NAME */}
      <Box
        w={"20%"}
        h={"100%"}
        p="md"
        style={{
          borderRadius: 8,
        }}
      >
        <Text weight={800} size="19px" ta={"center"}>
          Abbibas {item.productId.brand}
        </Text>
      </Box>

      {/* ACTIONS (QUANTITY & DELETE) */}
      <Box
        w={"20%"}
        h={"100%"}
        bg="white"
        p="md"
        display={"flex"}
        style={{
          flexDirection: "column",
          borderRadius: 8,
          gap: "45%",
        }}
      >
        <Box w={"100%"}>
          <ActionIcon
            ml={"65%"}
            variant="light"
            color="red"
            title="Remove item"
            onClick={onRemove}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Box>

        <Box display={"flex"} w={"100%"}>
          <ActionIcon
            ml={"15%"}
            variant="light"
            color="black"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <IconMinus size={18} />
          </ActionIcon>

          <Text ml={"10%"}>{quantity}</Text>

          <ActionIcon
            ml={"10%"}
            variant="light"
            color="black"
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Box>
      </Box>
    </Box>
  );
};

export default Cartdesign;
