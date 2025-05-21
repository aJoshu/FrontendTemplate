"use client";

import {
  TextInput,
  PasswordInput,
  Button,
  Divider,
  Stack,
  Text,
  Anchor,
  Title,
} from "@mantine/core";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { loginAPI } from "@/api/login/loginAPI";
import { signupAPI } from "@/api/login/signupAPI";
import { verifyEmailAPI } from "@/api/login/verifyEmailAPI";
import { loginWithGoogle } from "@/api/login/loginWithGoogle";
import { GoogleAuthProvider, setPersistence, browserLocalPersistence, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { signInWithCustomTokenFunc } from "@/api/auth/signInWithCustomToken";
import { auth } from "../../../firebaseConfig";
import { customNotification } from "@/components/notifications/customNotifications";


export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const codeLength = 6;
  const [values, setValues] = useState<string[]>(Array(codeLength).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);


  const redirect = () => {
    const redirectPath = localStorage.getItem("redirectPath");
    if (redirectPath) {
      window.location.href = redirectPath;
      localStorage.removeItem("redirectPath");
    } else {
      window.location.href = '/create';
    }
  }


  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginAPI(email, password);
      const { idToken } = await signInWithCustomTokenFunc(res.token);
      localStorage.setItem("firebaseIdToken", idToken);
      redirect();
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleVerifyEmail = async () => {
    if (!isValidEmail(email)) {
      customNotification(
        "Invalid email",
        "Please enter a valid email address",
      );
      return;
    }

    if (password.length < 6) {
      customNotification(
        "Password too short",
        "Password must be at least 6 characters",
      );
      return;
    }

    await verifyEmailAPI(email).then((res) => {
      if (res.success) {
        setShowCodeInput(true);
      } else {
        customNotification("Error", "Unable to send code");
      }
    });
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await signupAPI(email, password, values.join(""));
      const { idToken } = await signInWithCustomTokenFunc(res.authToken);
      localStorage.setItem("firebaseIdToken", idToken);
      redirect();
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await loginWithGoogle(idToken);
      redirect();
    } catch (err) {
      console.error("Google login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const setPasswordReset = async () => {
    if(!email)customNotification( "Error", "Email required!", );;
    try {
      await sendPasswordResetEmail(auth, email);
      customNotification(
        "Success",
        "Reset link sent!",
      );
    } catch (error) {
      customNotification(
        "Error",
        "Unable to send reset email",
      );
      throw error;
    }
  }


  return (
    <motion.div
      className="max-w-md mx-auto mt-40 px-6 w-full"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Stack gap="sm">
        <AnimatePresence mode="wait">
          <motion.div
            className="max-w-md mx-auto mt-8 px-6 w-full"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Stack gap="sm">
              {showCodeInput ? (
                <>
                  <Title order={2} size={28} fw={700} className="mb-4 text-center">
                    Enter Code
                  </Title>

                  <div className="flex gap-2 justify-center mt-2 mb-4">
                    {Array.from({ length: codeLength }).map((_, index) => (
                      <TextInput
                        key={index}
                        value={values[index]}
                        onChange={(e) => {
                          const val = e.currentTarget.value.slice(-1);
                          const newValues = [...values];
                          newValues[index] = val;
                          setValues(newValues);
                          if (val && index < codeLength - 1) {
                            inputsRef.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => {
                          const paste = e.clipboardData.getData("text").slice(0, codeLength);
                          const newValues = paste.split("").slice(0, codeLength);
                          setValues((prev) => {
                            const filled = [...prev];
                            newValues.forEach((char, i) => filled[i] = char);
                            return filled;
                          });
                          inputsRef.current[Math.min(codeLength - 1, newValues.length)]?.focus();
                        }}
                        ref={(el) => (inputsRef.current[index] = el)}
                        maxLength={1}
                        inputMode="numeric"
                        className="text-center font-mono"
                        styles={{ input: { width: 40, textAlign: "center", fontSize: 20 } }}
                      />
                    ))}
                  </div>

                  <Button
                    fullWidth
                    radius="xl"
                    color="brand"
                    onClick={handleRegister}
                    loading={loading}
                  >
                    Register
                  </Button>

                  <Button
                    fullWidth
                    radius="xl"
                    variant="light"
                    color="gray"
                    onClick={() => setShowCodeInput(false)}
                    mt={8}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? "login" : "register"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Title order={2} size={28} fw={700} className="mb-4">
                      {isLogin ? "Login" : "Create account"}
                    </Title>

                    <TextInput
                      label="Email"
                      placeholder="Email"
                      type="email"
                      mt={8}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="••••••••"
                      mt={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} />

                    <Button
                      fullWidth
                      radius="xl"
                      color="brand"
                      mt={16}
                      onClick={isLogin ? handleLogin : handleVerifyEmail}
                      loading={loading}
                    >
                      {isLogin ? "Login" : "Register"}
                    </Button>

                    <Divider label="or" labelPosition="center" className="my-4" />

                    <Button
                      fullWidth
                      variant="default"
                      radius="xl"
                      onClick={handleGoogleLogin}
                      loading={loading}
                    >
                      Continue with Google
                    </Button>

                    <Text size="sm" c="dimmed" ta="center" mt="sm">
                      {isLogin ? (
                        <Stack>
                          <Anchor onClick={() => setIsLogin(false)} underline="always">
                            Don’t have an account? Register
                          </Anchor>
                          <Anchor onClick={() => setPasswordReset()} c='black'>
                            Reset password
                          </Anchor>
                        </Stack>
                      ) : (
                        <Anchor onClick={() => setIsLogin(true)} underline="always">
                          Already have an account? Login
                        </Anchor>
                      )}
                    </Text>
                  </motion.div>
                </AnimatePresence>
              )}
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Stack>
    </motion.div>
  );
}
