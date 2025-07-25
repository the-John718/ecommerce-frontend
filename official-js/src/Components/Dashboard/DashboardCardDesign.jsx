import {
  Box,
  Tooltip,
  ActionIcon,
  Group,
  TextInput,
  Textarea,
  NumberInput,
  Card,
  Modal,
  Stack,
  Button,
  Image,
  Text,
  Checkbox,
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import {
  IconEye,
  IconHeart,
  IconShoppingCart,
  IconTrash,
  IconPencil,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import img2 from "../Images/product-pot-image-3.webp";
import { CardContext } from "../Context/AuthContext";

const Dashboardcard = ({ card, setCardData, addToRecycleBin }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const { cardData } = useContext(CardContext);
  const [quickOpened, { open: openQuick, close: closeQuick }] =
    useDisclosure(false);

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  return (
    <>
      <Box
        className="check-box section"
        w={"100%"}
        h={75}
        // bg={"violet"}
        display={"flex"}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {" "}
        <Box
          className="check-box"
          display={"flex"}
          h={"100%"}
          w={"5%"}
          style={{ alignItems: "center", justifyContent: "center" }}
          // bg={"dark"}
        >
          <Checkbox defaultChecked={false} />
        </Box>
        <Box
          className="card-body"
          w={"95%"}
          h={"95%"}
          // bg={"orange"}
          display={"flex"}
          style={{
            flexDirection: "row",
            // border: "2px solid gray",
            borderRadius: "28px",
            boxShadow: " 1px 2px 3px gray",
            alignItems: "center",
            gap: "19px",
            overflow: "hidden",
          }}
        >
          <Box
            className="image-section"
            h={65}
            w={65}
            // bg={"dark"}
            style={{
              borderRadius: "50%", // Make the container circular
              overflow: "hidden", // Clip image to circle
              display: "flex",
              alignItems: "center",
              border: "2px solid black",
              justifyContent: "center",
            }}
          >
            <Image
              src={card.images}
              width="100%"
              height="100%"
              fit="cover" // Fill the circle without distortion
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box
            className="product-name-box"
            w={"15%"}
            h={"100%"}
            // bg="grape"
            p="md"
            style={{
              overflow: "hidden",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Text
              className="text-content"
              weight={800}
              size="19px"
              ta={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 0.3s ease",
                lineHeight: 1.4,
              }}
            >
              {card.name}
            </Text>
          </Box>
          <Box
            className=" product-brand-name-box"
            w={"10%"}
            h={"100%"}
            // bg="grape"
            p="md"
            style={{
              overflow: "hidden",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Text
              className="text-content"
              weight={800}
              size="19px"
              ta={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 0.3s ease",
                lineHeight: 1.4,
              }}
            >
              {card.brand}
            </Text>
          </Box>
          <Box
            className="descriptin-box"
            w={"13%"}
            h={"100%"}
            // bg="grape"
            p="md"
            style={{
              overflow: "hidden",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Text
              className="text-content"
              weight={800}
              size="19px"
              ta={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 0.3s ease",
                lineHeight: 1.4,
              }}
            >
              {card.description}
            </Text>
          </Box>
          <Box
            className=" caategory-descripti0n-box"
            w={"15%"}
            h={"100%"}
            // bg="grape"
            p="md"
            style={{
              overflow: "hidden",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.3s ease",
              lineHeight: 1.4,
            }}
          >
            <Text
              className="text-content"
              weight={800}
              size="20px"
              ta={"center"}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 0.3s ease",
                lineHeight: 1.4,
              }}
            >
              {card.category}
            </Text>
          </Box>
          <Box className="price-section" h={"100%"} w={"10%"}>
            <Text weight={800} size="19px" ta={"center"} mt={"17%"}>
              ${card.price}
            </Text>
          </Box>
          <Box className="price-section" h={"100%"} w={"5%"}>
            <Text weight={800} size="19px" ta={"center"} mt={"30%"}>
              {card.stockAmount}
            </Text>
          </Box>
          <Box
            className="action-section"
            h={"100%"}
            w={"15%"}
            // ml={"9%"}
            // bg={"teal"}
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {" "}
            <Box
              className="border-box"
              mt={"2%"}
              h={"90%"}
              w={"97%"}
              // bg={"lime"}
              display={"flex"}
              style={{
                flexDirection: "row",
                // border: "2px solid gray",
                borderRadius: "27px",
              }}
            >
              <Group ml={"3%"} mb={"1%"} p={"5px"} gap={"19px"}>
                <Tooltip label="Edit" position="top-start" withArrow>
                  <ActionIcon
                    variant="white"
                    color="blue"
                    size="xl"
                    radius="xl"
                    style={{ boxShadow: "2px 2px 3px gray" }}
                    onClick={openEdit}
                  >
                    <IconPencil size={28} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete" withArrow position="top">
                  <ActionIcon
                    variant="white"
                    color="red"
                    size="xl"
                    radius="xl"
                    style={{ boxShadow: "2px 2px 3px gray" }}
                    onClick={() => {
                      setCardToDelete(card); // pass card to delete
                      setDeleteModalOpen(true);
                    }}
                  >
                    <IconTrash size={28} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Quick View" position="top-end" withArrow>
                  <ActionIcon
                    variant="white"
                    color="gray"
                    size="xl"
                    radius="xl"
                    style={{ boxShadow: "2px 2px 3px gray" }}
                    onClick={openQuick}
                  >
                    <IconEye size={27} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Box>
          </Box>
        </Box>
      </Box>
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
              <Text>{card.stockAmount}</Text>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Product"
        size="lg"
        centered
        zIndex={2000} // keep it above navbar
        overlayProps={{ blur: 3, opacity: 0.55 }}
      >
        <Box
          p="md"
          // bg="white"
          style={{
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
            maxWidth: 700,
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
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: 8,
                backgroundColor: "#f9f9f9",
              }}
            />
          </Box>

          {/* Title */}
          <Text weight={600} size="md" color="dimmed">
            Name
          </Text>
          <TextInput
            value={card.name}
            mb="md"
            radius="md"
            placeholder="Enter product name"
            required
          />

          {/* Brand & Category Row */}
          <Box style={{ display: "flex", gap: 20, marginBottom: 16 }}>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Brand
              </Text>
              <TextInput value={card.brand} radius="md" placeholder="Brand" />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Category
              </Text>
              <TextInput
                value={card.category}
                radius="md"
                placeholder="Category"
              />
            </Box>
          </Box>

          {/* Description */}
          <Text weight={600} size="md" color="dimmed">
            Description
          </Text>
          <Textarea
            value={card.description}
            autosize
            minRows={3}
            radius="md"
            mb="md"
            placeholder="Enter product description"
          />

          {/* Price & Qty Row */}
          <Box style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Price
              </Text>
              <NumberInput
                value={card.price}
                min={0}
                radius="md"
                placeholder="Price"
              />
            </Box>

            <Box style={{ flex: 1 }}>
              <Text weight={600} size="md" color="dimmed">
                Qty
              </Text>
              <NumberInput
                value={card.stockAmount}
                min={1}
                radius="md"
                placeholder="Quantity"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeEdit}>
              Cancel
            </Button>
            <Button color="teal">Save Changes</Button>
          </Group>
        </Box>
      </Modal>

      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        centered
      >
        <Text>
          Are you sure you want to delete <strong>{cardToDelete?.name}</strong>?
        </Text>
        <Group mt="md" position="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (cardToDelete) {
                addToRecycleBin(cardToDelete);
              }
              setDeleteModalOpen(false);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>

     
    </>
  );
};

export default Dashboardcard;
