"use client";

import { AppShell, Button, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DefaultCard from "./templates/card/default"; // Adjust path if needed


type ButtonRadius = "xs" | "sm" | "md" | "lg" | "xl";

type Theme = {
  bgColor: string;
  buttonColor: string;
  effect: string;
  buttonRadius: ButtonRadius;
  showGit: boolean;
  githubUsername: string;
};


const PRESET_THEMES: Theme[] = [
  {
    bgColor: "#ffffff",
    buttonColor: "#ef4444",
    effect: "static-pyramid",
    buttonRadius: "sm",
    showGit: false,
    githubUsername: '',
  },
  {
    bgColor: "#0f172a",
    buttonColor: "#facc15",
    effect: "none",
    buttonRadius: "md",
    showGit: true,
    githubUsername: 'aJoshu',
  },
  {
    bgColor: "#3b82f6",
    buttonColor: "#f5f5f5",
    effect: "animate-sheen",
    buttonRadius: "xl",
    showGit: false,
    githubUsername: '',
  },
  {
    bgColor: "#f43f5e",
    buttonColor: "#ffffff",
    effect: "animate-comic-lines",
    buttonRadius: "sm",
    showGit: false,
    githubUsername: '',
  },
];

export default function Home() {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = PRESET_THEMES[themeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % PRESET_THEMES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <div className="relative min-h-[calc(100vh-60px)] flex items-center">
        {/* Left Content */}
        <Container size="xl" px="md" className="mx-0">
          <motion.div
            className="max-w-[480px] ml-2 sm:ml-[10vw]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
          >
            <Stack gap="md">
              <Title order={1} size={48} fw={900} lh={1.2}>
                Share your side projects<br />in one beautiful link.
              </Title>
              <Text size="md" c="dimmed">
                Build a simple, customizable link-in-bio page just for your work. Designed for professionals.
              </Text>
              <motion.a
                style={{ width: "240px" }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Link href="/create">
                  <Button fullWidth radius="xl" h={48}>
                    Create Link
                  </Button>
                </Link>
              </motion.a>
            </Stack>
          </motion.div>
        </Container>

        {/* Right Live Card Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
        >
          <div className="hidden xl:block absolute right-[20vw] top-1/2 -translate-y-1/2 w-[350px] drop-shadow-md">
            <DefaultCard
              title="Projct"
              description="All your links in one place"
              projects={[
                { title: "Create Link", link: "https://brainstorm.gg" },
                { title: "Follow us", link: "https://x.com/JoshMcrk" },
              ]}
              editor={false}
              effect={theme.effect}
              bgColor={theme.bgColor}
              buttonColor={theme.buttonColor}
              buttonRadius={theme.buttonRadius}
              showGit={theme.showGit}
              githubUsername={theme.githubUsername}
              bottomText="Create in 3 clicks"
              size="full"
              cardId={""}
            />
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
