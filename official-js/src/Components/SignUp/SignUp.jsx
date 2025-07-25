import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  TextInput,
  PasswordInput,
  Flex,
  Stack,
} from "@mantine/core";
import mainimg from "../Images/sign-back-img1.jpg";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    ConfirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  /* ---------- handlers ---------- */
  const handleChange = (field, e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));

    if (
      (field === "ConfirmPassword" && value !== form.password) ||
      (field === "password" &&
        form.ConfirmPassword &&
        value !== form.ConfirmPassword)
    ) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.ConfirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");
    try {
      await axios.post(
        "https://ecommerce-backend-rvai.onrender.com/user/signup",
        { name: form.name, email: form.email, password: form.password }
      );
      toast.success("Signup successful!");
    } catch (err) {
      toast.error("Signup failed.");
    }
  };

  /* ---------- ui ---------- */
  return (
    <>
      <Toaster position="top-center" />
      <Box
        w="100vw"
        h="100vh"
        display="flex"
        style={{
          backgroundImage: `url(${mainimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* pushes form box to the right */}
        <Flex w="90%" justify="center" align="center" pr="100px">
          <Flex
            ml={"60%"}
            direction="column"
            align="center"
            w={"340px"}
            p="md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              border: "2px solid black",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            <Text
              fontWeight="bold"
              w={"75px"}
              // bg={"blue"}
              fw={700}
              h={"20%"}
              style={{
                fontFamily: '"Old English Text MT", "Cloister Black", serif',
                color: "black",
                fontSize: "33px",
              }}
            >
              Sign‑Up
            </Text>

            {/* Stack keeps uniform spacing (sm) between elements */}
            <Stack w="100%" spacing="1px" mt="1px">
              <TextInput
                label="Name"
                placeholder="Your full name"
                onChange={(e) => handleChange("name", e)}
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="your@email.com"
                onChange={(e) => handleChange("email", e)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                error={passwordError}
                onChange={(e) => handleChange("password", e)}
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                error={passwordError}
                onChange={(e) => handleChange("ConfirmPassword", e)}
              />
            </Stack>

            <Button
              fullWidth
              mt="lg"
              onClick={submit}
              style={{
                fontSize: 20,
                color: "black",
                backgroundColor: "#fff",
                border: "1px solid #555",
              }}
            >
              Register
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default Signup;
