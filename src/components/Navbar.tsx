"use client";

import {
  AppShellHeader,
  Burger,
  Drawer,
  Group,
  Button,
  ActionIcon,
  useMantineTheme,
  Menu,
  MenuDivider,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { COLORS } from "@/app/lib/Colors";
import { useAuth } from "@/app/context/AuthContext";
import { signOut, getAuth } from "firebase/auth";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const shouldHideNavbar =
    pathname &&
    /^\/[^/]+$/.test(pathname) &&
    !["/login", "/create", "/", "/analytics"].includes(pathname);

  if (shouldHideNavbar) return null;

  const { user, loading } = useAuth();
  const [opened, { close, toggle }] = useDisclosure(false);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    window.location.href = "/";
  };

  if (!mounted || loading) return null;

  return (
    <>
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
  style={{
    position: "fixed",
    top: scrolled ? 0 : 16,
    left: 0,
    right: 0,
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none", // ensure it doesn't block underlying clicks if needed
  }}
>
<div
  style={{
    width: scrolled ? "100%" : "calc(100% - 2rem)",
    maxWidth: scrolled ? "100%" : 980,
    height: 48, // 👈 THIS FIXES THE HEIGHT
    borderRadius: scrolled ? 0 : 12,
    backgroundColor: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border:'none',
    boxShadow: scrolled
      ? "0 2px 8px rgba(0,0,0,0.04)"
      : "0 0px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    pointerEvents: "auto",
  }}
>
  <AppShellHeader
    style={{
      height: "100%", // Fill the 64px wrapper
      paddingInline: 12,
      background: "transparent",
      boxShadow: "none",
      border:'none',
    }}
  >


          <Group px="md" className="h-full justify-between w-full">
            <Link href="/">
              <span
                style={{
                  borderLeft: `6px solid ${COLORS.primary}`,
                  paddingLeft: 4,
                  fontWeight: 600,
                }}
                className="font-bold text-lg"
              >
                TemplateName
              </span>
            </Link>

            {isMobile ? (
              <Burger opened={opened} onClick={toggle} aria-label="Toggle menu" />
            ) : (
              <Group>
                {!loading && user ? (
                  <>
                    <Link href="/create">
                      <Button variant={pathname === "/create" ? "filled" : "subtle"}>
                        Edit card
                      </Button>
                    </Link>
                    <Link href="/analytics">
                      <Button variant={pathname === "/analytics" ? "filled" : "subtle"}>
                        Analytics
                      </Button>
                    </Link>
                    <Menu offset={16} shadow="md" width={140} position="bottom-end">
                      <Menu.Target>
                        <Button variant={pathname === "/account" ? "filled" : "subtle"}>
                          Account
                        </Button>
                      </Menu.Target>
                      <Menu.Dropdown>
                      <Menu.Label style={{overflow:'hidden', fontSize:10}}>
                        {user.email}
                      </Menu.Label>
                        <Menu.Item onClick={() => window.location.href = "/create"} color="black">
                          Your card
                        </Menu.Item>
                        <Menu.Item onClick={handleLogout} color="black">
                          Log out
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link href="/">
                      <Button variant={pathname === "/" ? "filled" : "subtle"}>Home</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant={pathname === "/login" ? "filled" : "subtle"}>Login</Button>
                    </Link>
                  </>
                )}
              </Group>
            )}
          </Group>
        </AppShellHeader>
        </div>
      </motion.div>

      <Drawer
        opened={opened}
        onClose={close}
        padding="lg"
        zIndex={9999}
        size="100%"
        position="right"
        withCloseButton={false}
        overlayProps={{ opacity: 0.2 }}
      >
        <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
          <div className="flex flex-col gap-5">
            <div className="flex justify-end">
              <ActionIcon
                variant="light"
                onClick={close}
                size="lg"
                style={{ marginTop: -6, marginRight: -2 }}
              >
                <X size={20} />
              </ActionIcon>
            </div>
            {user ? (
              <>
                <Link href="/create" onClick={close}>
                  <Button variant="light" fullWidth>Edit card</Button>
                </Link>
                <Link href="/analytics" onClick={close}>
                  <Button variant="light" fullWidth>Analytics</Button>
                </Link>
                <Button variant="filled" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={close}>
                <Button variant="filled" fullWidth>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
