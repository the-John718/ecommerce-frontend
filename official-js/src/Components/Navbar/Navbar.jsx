import React, { useState } from "react";
import {
  Box,
  Burger,
  HoverCard,
  Avatar,
  Text,
  Drawer,
  Button,
  ActionIcon,
  Tabs,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconShoppingBag,
  IconShoppingCartPlus,
  IconUserCircle,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom"; // <- useNavigate, not Navigate

const Navbar = () => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState("first");
  const navigate = useNavigate(); // <- get the navigate function
   
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);

    switch (tabValue) {
      case "first":
        navigate("/");
        break;
      case "second":
        navigate("/search");
        break;
      case "third":
        navigate("/about");
        break;
      case "fourth":
        navigate("/contact");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Box
        w="100vw"
        h="70px"
        style={{
          position: "fixed",
          top: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "2px solid #dee2e6",
        }}
      >
        {/* Logo */}
        <Flex>
          <Box>
            <Text
              style={{
                marginTop: "18%",
                fontSize: "30px",
                fontFamily: '"Old English Text MT", "Cloister Black", serif',
                fontWeight: "bold",
                color: "#2b2d42",
              }}
            >
              𝔧/𝔰‑𝔧ohn𝔰𝓑𝓪𝔃𝓪𝓪𝓻
            </Text>
          </Box>
        </Flex>

        <Box
          bg={"cyan"}
          w={"30%"}
          ml={"35%"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tabs.List
              mr={"75%"}
              ml={"-90"}
              justify="center"
              // bg={"orange"}
              style={{
                fontSize: "22px",
                paddingBottom: "0px",
                marginBottom: "-36px",
                lineHeight: 1.2,
              }}
            >
              <Flex gap={"37%"} ml={"-17%"}>
                <Tabs.Tab value="first">Home</Tabs.Tab>
                <Tabs.Tab value="second">Shop   </Tabs.Tab>
                <Tabs.Tab value="third">About</Tabs.Tab>
                <Tabs.Tab value="fourth">Contact</Tabs.Tab>
              </Flex>
            </Tabs.List>
          </Tabs>
        </Box>
        <Box
          w={"170"}
          mt={"2%"}
          style={{
            gap: "12",
            justifyContent: "space-evenly",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ActionIcon variant="transparent" size="lg" aria-label="Search" onClick={()=>{
            navigate("/search")
          }}>
            <IconSearch size={25} />
          </ActionIcon>

          <ActionIcon variant="transparent" size="lg" aria-label="Cart" onClick={()=>{
            navigate("/cartsection")
          }}>
            <IconShoppingBag size={25} />
          </ActionIcon>


          <HoverCard width={160} shadow="md" openDelay={100} closeDelay={300}>
            <HoverCard.Target>
              <Avatar
                radius="xl"
                variant="transparent"
                color="blue"
                // size="lg"
                style={{ cursor: "pointer" }}
              >
                <IconUserCircle size={28} />
              </Avatar>
            </HoverCard.Target>

            <HoverCard.Dropdown>
              <Box
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // transparent white (adjust alpha)
                  backdropFilter: "blur(10px)",
                  // border: "2px solid orange",
                  outlineOffset: "2px",
                  backgroundColor: "transparent",
                  borderRadius: "8px",
                  padding: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // optional soft shadow
                }}
              >
                <Button
                  fullWidth
                  mb="sm"
                  onClick={() => {
                    close(); // hide the drawer
                    navigate("/Login"); // navigate programmatically
                  }}
                >
                  Login
                </Button>
                <Button fullWidth variant="outline" onClick={() =>{ navigate("/signup")}}>
                  Sign Up
                </Button>
              </Box>
            </HoverCard.Dropdown>
          </HoverCard>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
