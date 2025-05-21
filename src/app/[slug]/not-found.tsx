"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const DARK_COLORS = [
  "#0f172a",
  "#1e293b",
  "#111827",
  "#0c0a09",
  "#2e2e2e",
  "#1f1f1f",
];

function getRandomDarkColor() {
  return DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)];
}

export default function NotFound() {
  const bgColor = getRandomDarkColor();

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center px-4 py-12 bg-gradient-to-br from-black via-slate-900 to-gray-900">
      {/* Optional blurred glow background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-2xl bottom-[-100px] right-[-100px]" />
      </div>

      <div
        className="w-full max-w-[360px] aspect-[9/14.5] rounded-[32px] flex flex-col justify-center items-center px-6 py-8 shadow-2xl"
        style={{ backgroundColor: bgColor }}
      >

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-white text-xl font-semibold mb-2 text-center"
        >
          Card Not Found :(
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white text-sm text-center opacity-80 mb-6 leading-relaxed"
        >
          This card doesn’t exist or may have been removed.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white text-sm text-center opacity-80 mb-6 leading-relaxed"
        >
          <Link
            href="/"
            className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl"
          >
            Back to projct.dev
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
