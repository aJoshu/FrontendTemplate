import { createTheme } from "@mantine/core";

const theme = createTheme({
  colors: {
    brand: [
      "#fff5f5", // 0 - lightest blush
      "#ffe3e3", // 1
      "#ffc9c9", // 2
      "#ffa8a8", // 3
      "#ff8787", // 4
      "#e63946", // 5 - base (bold red)
      "#d6336c", // 6 - deeper accent
      "#c92a2a", // 7 - strong red
      "#a51111", // 8 - warning red
      "#800000", // 9 - darkest red
    ],
  },
  primaryColor: "brand",
  primaryShade: 5,
});

export default theme;
