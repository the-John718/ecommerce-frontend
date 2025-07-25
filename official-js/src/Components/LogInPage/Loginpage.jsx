import {
  Box,
  Flex,
  Image,
  Button,
  Text,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import imgs from "../Images/right-box-pic.png";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const LogInpage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  function handleChange(field, e) {
    const value = e.target.value;
    console.log(`✅ Field [${field}] changed to:`, value);
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function logvalue() {
    console.log("✅ STEP 1: Login button clicked");
    console.log("✅ STEP 2: Current form data:", form);

    try {
      const res = await axios.post(
        "https://ecommerce-backend-rvai.onrender.com/user/login",
        form
      );

      console.log("✅ STEP 3: Response received from backend:",res);

      if (res.data && res.data.token) {
        console.log("✅ STEP 4: Token received:", res.data.token);
        localStorage.setItem(
          "Authorization",
          "Bearer Bearer " + res.data.token
        );
        toast.success("Login successful!");
       
       if (res.data.user && res.data.user.isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
            
      } else {
        console.log("❌ STEP 4: Token not found in response");
        toast.error("Login failed: Token not received.");
      }
    } catch (err) {
      console.error("❌ STEP 3: Error during login:", err);
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <>
       <Toaster position="top-center" />
    <Box
      w="100vw"
      h="100vh"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #f1d7c2, #78604d)",
        overflow: "hidden",
      }}
    >
      <Box
        w="65%"
        h="80%"
        style={{
          display: "flex",
          borderRadius: "20px",
          boxShadow: "0 0 10px rgb(247, 238, 238)",
          border: "7px solid white",
          borderRight: "7px solid white",
          overflow: "hidden",
        }}
      >
        {/* LEFT SECTION */}
        <Box
          w="50%"
          h="100%"
          style={{
            background: "#F8F6F7",
            display: "flex",
            flexDirection: "column",
            gap: "5%",
          }}
        >
          <Box>
            <Text
              ml={"12%"}
              mt={"20%"}
              style={{
                fontSize: "30px",
                fontFamily: '"Old English Text MT", "Cloister Black", serif',
                fontWeight: "bold",
                color: "#2b2d42",
              }}
            >
              𝔧/𝔰‑𝔧ohn𝔰Bazaar.com
            </Text>
          </Box>

          <Box>
            <Text
              ml={"12%"}
              mt={"-10%"}
              style={{
                fontSize: 11,
                color: "#000000",
                fontFamily: "serif",
                fontWeight: "revert",
              }}
            >
              <h1>Welcome-to-login</h1>
            </Text>
          </Box>

          <Box
            className="input-section"
            display={"flex"}
            style={{ flexDirection: "column", gap: "70px" }}
          >
            <Box
              display={"flex"}
              style={{ flexDirection: "column" }}
              w={"80%"}
              h={"30%"}
              ml={"12%"}
            >
              <TextInput
                style={{ padding: "7px" }}
                label="Email"
                labelProps={{
                  style: {
                    color: "#2B2D42",
                    fontWeight: 400,
                    fontSize: "17px",
                  },
                }}
                placeholder="your@email.com"
                type="email"
                required
                onChange={(e) => handleChange("email", e)}
              />
              <PasswordInput
                style={{ padding: "7px" }}
                label="Password"
                labelProps={{
                  style: {
                    color: "#2B2D42",
                    fontWeight: 400,
                    fontSize: "17px",
                  },
                }}
                placeholder="Your password"
                mt="md"
                required
                onChange={(e) => handleChange("password", e)}
              />
            </Box>

            <Box
              w="80%"
              ml="12%"
              display={"flex"}
              style={{
                gap: "18%",
                color: "#2B2D42",
                fontWeight: 400,
                fontSize: "17px",
              }}
            >
              <Box mb="xs">
                <Text
                  component={Link}
                  to="#"
                  size="sm"
                  style={{ color: "#2B2D42" }}
                >
                  Forgot your password?
                </Text>
              </Box>

              <Box>
                <Text size="sm" style={{ color: "#2B2D42" }}>
                  Create an account –{" "}
                  <Text
                    component={Link}
                    to="/SignUp"
                    size="sm"
                    style={{
                      textDecoration: "underline",
                      color: "#2B2D42",
                      display: "inline",
                    }}
                  >
                    Sign-up
                  </Text>
                </Text>
              </Box>
            </Box>

            <Box mt={"-50px"}>
              <Button
                fullWidth
                w={"70%"}
                ml={"17%"}
                color="#785C48"
                radius="md"
                onClick={logvalue}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Box>

        {/* RIGHT IMAGE SECTION */}
        <Box
          w="50%"
          h="100%"
          style={{
            position: "relative",
          }}
        >
          <Image
            src={imgs}
            alt="Login Visual"
            width="100%"
            height="100%"
            fit="cover"
            style={{
              display: "block",
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
          />
        </Box>
      </Box>
    </Box>
    </>
  );
};

export default LogInpage;
