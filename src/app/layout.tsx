import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import theme from "./theme";
import "./globals.css";
import { Notifications } from "@mantine/notifications";
import AppWrapper from "./AppWrapper";

export const metadata: Metadata = {
  title: "Projct.gg",
  description: "Seo desc",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/icon.png" sizes="48x48" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications style={{ position: "fixed", top: 116, zIndex: 999 }} />
          <AppWrapper>{children}</AppWrapper>
        </MantineProvider>
      </body>
    </html>
  );
}
