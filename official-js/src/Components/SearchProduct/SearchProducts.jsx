import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import {
  Box,
  Autocomplete,
  RangeSlider,
  Text,
  Flex,
  Stack,
  Checkbox,
  Center,
} from "@mantine/core";
import { CardContext } from "../Context/AuthContext";
import Cardshow from "../Card/Cards";
import { Toaster } from "react-hot-toast";

const SearchProducts = () => {
  const isMd = useMediaQuery("(max-width: 890px)");
  const { cardData } = useContext(CardContext);

  const [query, setQuery] = useState("");
  const [selectedRange, setSelectedRange] = useState([0, 20000]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [filteredCards, setFilteredCards] = useState([]);
  const [uniqueMap, setUniqueMap] = useState(new Map());
  const [allCategories, setAllCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  // ✅ 1. Prepare uniqueMap (no duplicate names) + all category list
  useEffect(() => {
    const map = new Map();
    const categorySet = new Set();

    cardData.forEach((item) => {
      if (!map.has(item.name)) {
        map.set(item.name, item);
        if (item.category) categorySet.add(item.category);
      }
    });

    setUniqueMap(map);
    setAllCategories(Array.from(categorySet));
  }, [cardData]);

  // ✅ 2. Filtering Logic
  useEffect(() => {
    const allProducts = Array.from(uniqueMap.values()); // or use full cardData if needed

    const byCategory = selectedCategories.size
      ? allProducts.filter((item) => selectedCategories.has(item.category))
      : allProducts;

    const byPrice = byCategory.filter(
      (item) => item.price >= selectedRange[0] && item.price <= selectedRange[1]
    );

    const searchText = query.trim().toLowerCase();

    const bySearch = searchText
      ? byPrice.filter((item) => item.name.toLowerCase().includes(searchText))
      : byPrice;

    setFilteredCards(bySearch);

    console.log("🔍 Search query:", query);
    console.log("✅ Filtered items:", bySearch);
  }, [query, selectedRange, selectedCategories, uniqueMap]);

  // ✅ Category checkbox toggle
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(category) ? next.delete(category) : next.add(category);
      return next;
    });
  };

  const handleBoxScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount((prev) => prev + 10); // load 10 more cards
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <Box bg="#f5f5f5" w="100%" minH="100vh" p="md">
        {/* 🔍 Search Bar */}
        <Flex align="center" justify="space-between" mb="lg">
          <Box w={40} />
          <Center style={{ width: "80%" }}>
            <Autocomplete
              placeholder="Search your items"
              data={Array.from(uniqueMap.values()).map((p) => p.name)}
              clearable
              w={isMd ? "100%" : "50%"}
              value={query}
              onChange={setQuery}
            />
          </Center>
          <Box w={40} />
        </Flex>

        {/* 📦 Filter + Card Section */}
        <Flex
          direction={isMd ? "column" : "row"}
          align="flex-start"
          justify="center"
          gap="xl"
        >
          {/* 🔧 Filters */}
          <Box
            w={isMd ? "100%" : "300px"}
            p="md"
            bg="white"
            style={{
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            <Text fw={600} size="lg" mb="sm">
              Filter by Category
            </Text>
            <Stack spacing="sm">
              {allCategories.map((cat) => (
                <Checkbox
                  key={cat}
                  label={cat}
                  checked={selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                />
              ))}
            </Stack>

            <Box mt="xl">
              <Text size="lg" fw={500} mb="xs">
                Price Range
              </Text>
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
            </Box>
          </Box>

          {/* 🧾 Cards Grid */}
          <Box
            className="card-section"
            w="100%"
            p="md"
            bg="#f8f9fa"
            onScroll={handleBoxScroll}
            style={{
              display: "grid",
              gridTemplateColumns: isMd ? "1fr" : "repeat(3, 1fr)", // grid layout
              gap: "16px",
              overflowY: "auto", // scrollable vertically
              overflowX: "hidden", // no side scroll
              height: "calc(100vh - 250px)", // adjust based on header/filters
              borderRadius: 16,
            }}
          >
            {filteredCards.slice(0, visibleCount).map((card) => (
              <Cardshow key={card._id} card={card} />
            ))}

            {filteredCards.length === 0 && (
              <Text align="center" w="100%">
                No products found.
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default SearchProducts;
