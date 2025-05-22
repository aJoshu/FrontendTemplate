"use client";

import { AppShell, Button, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { motion } from "framer-motion";


export default function Home() {

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
                Clean frontend Template
              </Title>
              <Text size="md" c="dimmed">
                Next, Mantine, framer-motion, tailwind frontend template by aJoshu
              </Text>
              <motion.a
                style={{ width: "240px" }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <Link href="/dashboard">
                  <Button fullWidth radius="xl" h={48}>
                    Action Button
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
        </motion.div>
      </div>
    </AppShell>
  );
}
