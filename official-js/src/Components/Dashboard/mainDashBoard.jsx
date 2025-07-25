import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Text,
  TextInput,
  Stack,
  RangeSlider,
  ActionIcon,
  HoverCard,
  Indicator,
  Avatar,
  Loader,
  Menu,
  Button,
  Flex,
  Modal,
  Image,
  NumberInput,
  Textarea,
  Group,
  Autocomplete,
  Checkbox,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconChevronDown,
  IconPlus,
  IconMessageCircle,
  IconMail,
  IconUpload,
  IconShoppingBag,
  IconUserCircle,
  IconTrash,
} from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { CardContext } from "../Context/AuthContext";
import { useForm } from "@mantine/form";
import Cardshow from "../Card/Cards";
import Dashboardcard from "./DashboardCardDesign";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
// modal section //
const API_URL = "https://ecommerce-backend-rvai.onrender.com/admin/product";

const notify = () => toast("Here is your toast.");
const AddProductModal = ({ opened, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    brand: "",
    stockAmount: 1,
    category: "",
    colors: "",
    sizes: "",
    isFeatured: false,
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("Authorization");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("description", form.description.trim());
      fd.append("price", form.price);
      fd.append("brand", form.brand.trim());
      fd.append("stockAmount", form.stockAmount);
      fd.append("category", form.category.trim());
      fd.append("isFeatured", form.isFeatured);

      form.colors.split(",").map((c) => fd.append("colors", c.trim()));
      form.sizes.split(",").map((s) => fd.append("sizes", s.trim()));

      form.images.forEach((file) => {
        fd.append("images", file);
      });

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      toast.success("Product added successfully!");
      onSuccess?.(data);
      setForm({
        name: "",
        description: "",
        price: 0,
        brand: "",
        stockAmount: 1,
        category: "",
        colors: "",
        sizes: "",
        isFeatured: false,
        images: [],
      });
      onClose();
    } catch (err) {
      // console.error("Submit error:", err.message);
      toast.error(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Product"
      zIndex={2000}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Group grow>
            <TextInput
              label="Name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <TextInput
              label="Brand"
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              required
            />
          </Group>

          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
          />

          <Group grow>
            <TextInput
              label="Category"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
            />
            <NumberInput
              label="Price"
              value={form.price}
              onChange={(val) => handleChange("price", val)}
              required
            />
          </Group>

          <NumberInput
            label="Stock Amount"
            value={form.stockAmount}
            onChange={(val) => handleChange("stockAmount", val)}
            required
          />

          <TextInput
            label="Colors (comma separated)"
            value={form.colors}
            onChange={(e) => handleChange("colors", e.target.value)}
          />

          <TextInput
            label="Sizes (comma separated)"
            value={form.sizes}
            onChange={(e) => handleChange("sizes", e.target.value)}
          />

          <Dropzone
            onDrop={(files) => handleChange("images", files)}
            accept={IMAGE_MIME_TYPE}
            multiple
            maxSize={3 * 1024 ** 2}
          >
            <Text>Drag & drop images here</Text>
            {form.images.length > 0 && (
              <Group mt="md" spacing="xs">
                {form.images.map((file, i) => (
                  <Image
                    key={i}
                    src={URL.createObjectURL(file)}
                    width={100}
                    height={100}
                    radius="md"
                  />
                ))}
              </Group>
            )}
          </Dropzone>

          <Group position="right" mt="md">
            <Button type="submit" loading={loading}>
              Add Product
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

const MainDashboard = () => {
  const [cardData, setCardData] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState([0, 20000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCard, setShowCard] = useState(cardData);
  const [visibleCount, setVisibleCount] = useState(10);
  const [modalOpened, setModalOpened] = useState(false);
  const [lowStockModal, setLowStockModal] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [uniqueMap, setUniqueMap] = useState(new Map());
  const [allCategories, setAllCategories] = useState([]);
  const [productData, setProductData] = useState([]);
  const [recycleBin, setRecycleBin] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [recycleBinOpen, setRecycleBinOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("Authorization");

        const data = await axios
          .get("https://ecommerce-backend-rvai.onrender.com/admin/product", {
            headers: {
              Authorization: token,
            },
          })
          .then((res) => res.data.products);

        setCardData(data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Could not load product data"
        );
      }
    };

    getData();
  }, []);

  useEffect(() => {
    setProductData(cardData);
    console.log("📦 cardData updated:", cardData);
  }, [cardData]);

  useEffect(() => {
    const lowStock = cardData.filter((p) => p.stockAmount < 5);
    setLowStockProducts(lowStock);
  }, [cardData]);

  useEffect(() => {
    const categorySet = new Set();

    cardData.forEach((item) => {
      if (item.category) categorySet.add(item.category);
    });

    setUniqueMap(cardData); // ✅ Store all products directly
    setAllCategories(Array.from(categorySet));
  }, [cardData]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBoxScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount((prev) => prev + 10); // load 10 more cards
    }
  };

  const HeaderRow = () => {
    return (
      <Box
        w="100%"
        h={40}
        // bg="#ced4da"
        display="flex"
        style={{
          // border: "2px solid white",
          // borderRadius: 28,
          alignItems: "center",
          // padding: "0 11px",
          fontWeight: 1000,
          fontSize: "24px",
          // gap: "17px",
        }}
      >
        {/* Empty space for checkbox */}
        <Box w="5%"></Box>

        {/* Image */}
        <Box w={75}>
          <Text ta="center" style={{ fontSize: "24px" }}>
            Image
          </Text>
        </Box>

        {/* Title */}
        <Box w="15%" ml={"3%"}>
          <Text ta="center" style={{ fontSize: "22px" }}>
            Title
          </Text>
        </Box>

        {/* Brand */}
        <Box w="10%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Brand
          </Text>
        </Box>

        {/* Description */}
        <Box w="13%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Description
          </Text>
        </Box>

        {/* Category */}
        <Box w="15%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Category
          </Text>
        </Box>

        {/* Price */}
        <Box w="10%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Price
          </Text>
        </Box>

        {/* Qty */}
        <Box w="5%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Qty
          </Text>
        </Box>

        {/* Actions */}
        <Box w="15%">
          <Text ta="center" style={{ fontSize: "22px" }}>
            Actions
          </Text>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    let filtered = cardData;

    // 1. Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // 2. Filter by price
    filtered = filtered.filter(
      (item) => item.price >= selectedRange[0] && item.price <= selectedRange[1]
    );

    // 3. Filter by search query
    if (query) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setShowCard(filtered);
  }, [cardData, selectedCategories, selectedRange, query]);

  useEffect(() => {
    setCategories(allCategories);
  }, [allCategories]);

  // { tabs-section start from here }//
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("first");

  const handleTabChange = (val) => {
    setActiveTab(val);
    switch (val) {
      case "first":
        navigate("/Dashboard");
        break;
      case "second":
        navigate("/");
        break;
      case "third":
        navigate("/search");
        break;
      case "fourth":
        navigate("/about");
        break;
      case "fifth":
        navigate("/contact");
        break;
      default:
        break;
    }
  };
  // { tab-section-End}//

  const addToRecycleBin = (deletedCard) => {
    setRecycleBin((prevBin) => [deletedCard, ...prevBin]);
    setCardData((prevData) =>
      prevData.filter((item) => item._id !== deletedCard._id)
    );
  };
  return (
    <>
      <Toaster position="top-center" />
      <Box
        className="main-section"
        h="100vh"
        w="100vw"
        style={{
          background: "linear-gradient(to top, lightyellow, lightblue)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          className="nav-section"
          h="70px"
          w="100%"
          // bg="grape"
          px={20}
          // pos="fixed"
          top={0}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #dee2e6",
            zIndex: 1000,
          }}
        >
          {/* Logo */}
          <Text
            fw={700}
            fz={30}
            lh={1}
            sx={{ fontFamily: '"Old English Text MT","Cloister Black",serif' }}
            c="#2b2d42"
          >
            𝔧/𝔰‑𝔧ohn𝔰𝓑𝓪𝔷𝓪𝓪𝓻
          </Text>

          {/* Center Tabs */}
          <Tabs value={activeTab} onChange={handleTabChange} mt={"2.4%"}>
            <Tabs.List>
              <Flex gap={40}>
                <Tabs.Tab value="first">Dashboard</Tabs.Tab>
                <Tabs.Tab value="second">Home</Tabs.Tab>
                <Tabs.Tab value="third">Shop</Tabs.Tab>
                <Tabs.Tab value="fourth">About</Tabs.Tab>
                <Tabs.Tab value="fifth">Contact</Tabs.Tab>
              </Flex>
            </Tabs.List>
          </Tabs>

          {/* Right Icons */}
          <Flex align="center" gap={16}>
            <ActionIcon
              variant="transparent"
              size="lg"
              onClick={() => navigate("/search")}
            >
              <IconSearch size={25} />
            </ActionIcon>

            <ActionIcon variant="transparent" size="lg">
              <IconShoppingBag size={25} />
            </ActionIcon>

            <HoverCard width={160} shadow="md" openDelay={100} closeDelay={300}>
              <HoverCard.Target>
                <Avatar radius="xl" sx={{ cursor: "pointer" }}>
                  <IconUserCircle size={28} />
                </Avatar>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Button fullWidth mb="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </HoverCard.Dropdown>
            </HoverCard>
          </Flex>
        </Box>

        {/* Optional content section */}
        <Box mt="1%" w={"100%"} h={143}>
          <Text
            ml={"5%"}
            mt={"60"}
            style={{
              fontSize: "48px",
              color: "#000000",
              fontFamily: "serif",
              textAlign: "start",
              fontWeight: "revert",
            }}
          >
            Welcome to DashBoard
          </Text>
        </Box>
        <Box
          className=" Action-section"
          w="97%"
          flex={1}
          mb={"1.1%"}
          h="auto" // allow it to grow with content
          // m="1px"
          // bg="orange"
          display="flex"
          ml="2%"
          style={{
            border: "3px solid white",
            boxShadow: "3px 3px 3px 5px gray",
            borderRadius: "28px",
            flexDirection: "column",
            gap: "6px",
            overflow: "hidden",
          }}
        >
          {/* ----- Filter & Search Row ----- */}
          <Box
            className="collect-togethher"
            w="100%"
            h={100}
            p={"5px"}
            display="flex"
            // bg="lightgray"
            style={{
              borderRadius: 20,
              flexDirection: "row",
            }}
          >
            <Box
              className="Action-button"
              w={"85%"}
              h={70}
              ml={"2%"}
              // bg={"red"}
              m={"7px"}
              display={"flex"}
              style={{
                // border: "3px  solid gray",
                boxShadow: "4px 3px 8px gray",
                borderRadius: "28px",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",

                gap: "5%",
              }}
            >
              {/* 1. Category menu */}
              <Menu width={180} withinPortal>
                <Menu.Target>
                  <Button
                    rightSection={<IconChevronDown size={20} />}
                    variant="white"
                    radius="lg"
                    color="black"
                  >
                    Category
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Stack px="xs" py="sm" spacing="xs">
                    <Text fw={600} size="lg" mb="xs">
                      Categories
                    </Text>

                    {categories.map((cat) => (
                      <Checkbox
                        key={cat}
                        label={cat}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                    ))}
                  </Stack>
                </Menu.Dropdown>
              </Menu>

              {/* 2. Price menu (range slider inside) */}
              <Menu width={320} withinPortal>
                <Menu.Target>
                  <Button
                    rightSection={<IconChevronDown size={25} />}
                    variant="default"
                    radius="lg"
                  >
                    Price
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Stack
                    py={"5%"}
                    px={"5%"}
                    style={{
                      borderRadius: "22px",
                      backgroundColor: "white",
                    }}
                  >
                    <RangeSlider
                      value={selectedRange}
                      onChange={setSelectedRange}
                      min={0}
                      max={20000}
                      step={500}
                      marks={[
                        { value: 0, label: "0" },
                        { value: 5000, label: "5000" },
                        { value: 10000, label: "10000" },
                        { value: 15000, label: "15000" },
                        { value: 20000, label: "20000" },
                      ]}
                    />
                  </Stack>
                </Menu.Dropdown>
              </Menu>

              {/* 3. Status menu */}
              <Menu width={140} withinPortal>
                <Menu.Target>
                  <Button
                    rightSection={<IconChevronDown size={16} />}
                    variant="default"
                    radius="lg"
                  >
                    Status
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item>In stock</Menu.Item>
                  <Menu.Item>Sold out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              {/* Search bar */}
              <Autocomplete
                mr={"2%"}
                placeholder="Search your items"
                data={[...new Set(cardData.map((p) => p.name).filter(Boolean))]}
                clearable
                w={400}
                radius="lg"
                value={query}
                onChange={setQuery}
              />
            </Box>
            <Box
              className="plus-section"
              w={"10%"}
              m={"5px"}
              h={70}
              // bg={"green"}
              display={"flex"}
              style={{
                // border: "3px  solid gray",
                borderRadius: "28px",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Flex gap="25%" ml={"7%"} style={{ alignItems: "center" }}>
                <ActionIcon
                  variant="white"
                  color="black"
                  radius="xl"
                  style={{ boxShadow: "4px 3px 8px gray" }}
                  size="lg"
                  // onClick={() => console.log("Plus clicked")}
                  onClick={() => setModalOpened(true)}
                >
                  <IconPlus size={22} />
                </ActionIcon>

                <Indicator
                  label={lowStockProducts.length}
                  size={18}
                  color="red"
                  offset={7}
                  disabled={lowStockProducts.length === 0}
                >
                  <ActionIcon
                    variant="white"
                    radius="xl"
                    color="black"
                    style={{ boxShadow: "4px 3px 8px gray" }}
                    size="lg"
                    onClick={() => setLowStockModal(true)} // 👈 open modal on click
                  >
                    <IconMail size={22} />
                  </ActionIcon>
                </Indicator>

                <ActionIcon
                  variant="white"
                  radius="xl"
                  color="black"
                  style={{ boxShadow: "4px 3px 8px gray" }}
                  size="lg"
                  onClick={() => setRecycleBinOpen(true)}
                  title="Recycle Bin"
                >
                  <IconTrash size={22} />
                </ActionIcon>
              </Flex>
            </Box>
          </Box>
          <HeaderRow />
          <Divider color="#adb5bd" size="sm" variant="dashed" my="xs" />
          <Box
            className="card-section"
            w="100%"
            p="md"
            // bg="#f8f9fa"
            flex={1}
            style={{
              borderRadius: 16,
              display: "flex",
              flexDirection: "column", // stack cards vertically
              gap: 16,
              overflowY: "auto", // vertical scroll
              overflowX: "hidden", // NO horizontal scroll
              height: "calc(100vh - 300px)", // same fixed height
            }}
            onScroll={handleBoxScroll} // load‑more handler
          >
            {showCard.slice(0, visibleCount).map((p) => (
              <Dashboardcard
                key={p._id || p.name}
                card={p}
                setCardData={setCardData}
                addToRecycleBin={addToRecycleBin}
              />
            ))}
          </Box>
        </Box>
        <AddProductModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          onSuccess={(newProduct) => {
            console.log("Product added successfully:", newProduct);
            if (newProduct && newProduct.name) {
              setCardData((prev) => [newProduct, ...prev]);
            }
          }}
        />
      </Box>

      <Modal
        opened={lowStockModal}
        onClose={() => setLowStockModal(false)}
        title="⚠ Low Stock Alerts"
        centered
        overlayProps={{ blur: 2, opacity: 0.3 }}
      >
        {lowStockProducts.length === 0 ? (
          <Text>No products with low stock.</Text>
        ) : (
          <Stack>
            {lowStockProducts.map((p) => (
              <Text key={p._id || p.name}>
                🔻 <strong>{p.name}</strong> has only{" "}
                <strong>{p.stockAmount}</strong> left in stock.
              </Text>
            ))}
          </Stack>
        )}
      </Modal>

      <Modal
        opened={recycleBinOpen}
        onClose={() => setRecycleBinOpen(false)}
        title="🗑 Recycle Bin"
        centered
      >
        {recycleBin.length === 0 ? (
          <Text>No deleted items.</Text>
        ) : (
          <Stack>
            {recycleBin.map((item) => (
              <Group key={item._id} position="apart">
                <Text>{item.name}</Text>
                <Button
                  size="xs"
                  onClick={() => {
                    // Restore item to main list
                    setCardData((prev) => [item, ...prev]);
                    setRecycleBin((prev) =>
                      prev.filter((p) => p._id !== item._id)
                    );
                  }}
                >
                  Undo
                </Button>
              </Group>
            ))}
          </Stack>
        )}
      </Modal>

      <Modal
        opened={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        title="Confirm Deletion"
        centered
      >
        <Text>
          Are you sure you want to delete <strong>{cardToDelete?.name}</strong>?
        </Text>
        <Group mt="md" position="right">
          <Button variant="default" onClick={() => setCardToDelete(null)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              addToRecycleBin(cardToDelete);
              setCardToDelete(null);
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default MainDashboard;
