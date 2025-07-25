import { React, useContext, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Box, Image, Text, Button } from "@mantine/core";
import modle from "../Images/modle.png";
import model1 from "../Images/model1.png";
import { CardContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const { cardData, productData } = useContext(CardContext);
   const navigate = useNavigate()
  useEffect(() => {}, cardData);

  return (
    <>
      <Navbar />
      <Box
        className="main-display"
        w={"100vw"}
        h={"100vh"}
        top={"0"}
        display={"flex"}
      >
        <Box
          className="Fist-box "
          bg={"#E9E3D7"}
          w={"100vw"}
          h={"100vh"}
          top={"0"}
          display={"flex"}
        >
          <Box
            className="Texts"
            w={"50%"}
            h={"70%"}
            // bg={"gray"}
            mt={"10%"}
            ml={"5%"}
            style={{ alignContent: "flex-start" }}
          >
            <Text
              ml={"8%"}
              style={{
                fontSize: 100,
                fontFamily: '"Old English Text MT", "Cloister Black", serif',
                fontWeight: "bold",
                color: "#2b2d42",
              }}
            >
              New
            </Text>
            <Text
              ml={"6%"}
              mt={"-90"}
              style={{
                fontSize: 150,
                fontFamily: '"Old English Text MT", "Cloister Black", serif',
                fontWeight: "bold",
                color: "#2b2d42",
              }}
            >
              Arrivals
            </Text>
            <Text
              ml={"5%"}
              mt={"-60"}
              style={{
                fontSize: 28,
                color: "#000000",
                fontFamily: "serif",
                fontWeight: "revert",
              }}
            >
              <h1>Discover the latest trends</h1>
            </Text>
            <Button
              fullWidth
              variant="outline"
              w={"30%"}
              h={"10%"}
              ml={"5%"}
              color="dark"
              style={{
                boxShadow: "1px 4px 7px rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
              }}
              onClick={() => {
                 navigate("/search");
              }}
            >
              Shop Now
            </Button>
          </Box>

          <Box
            className="Modle-pic"
            w={"30%"}
            h={"650px"}
            bg={"dark"}
            mt={"7%"}
            ml={"4%"}
          >
            <Image
              src={model1}
              // alt="Unsplash"
              width={"40%"}
              height={"100%"}
              fit="fill"
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                // light overlay to soften white edges if present
                mixBlendMode: "multiply",
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Main;
