import { alpha, createTheme } from "@mui/material/styles"

import type { ThemeMode } from "@/app/model/app-slice.ts"

export const getTheme = (themeMode: ThemeMode) => {
  const isDark = themeMode === "dark"

  return createTheme({
    palette: {
      mode: themeMode,
      primary: { main: isDark ? "#818CF8" : "#4F46E5" },
      secondary: { main: "#F59E0B" },
      success: { main: isDark ? "#4ADE80" : "#16A34A" },
      background: {
        default: isDark ? "#0E1117" : "#F5F6FA",
        paper: isDark ? "#161B22" : "#FFFFFF",
      },
      divider: isDark ? alpha("#FFFFFF", 0.08) : alpha("#0F172A", 0.08),
      text: {
        primary: isDark ? "#E6EDF3" : "#0F172A",
        secondary: isDark ? "#8B949E" : "#64748B",
      },
    },
    // sx `borderRadius: n` multiplies this value: 2.5 → 10px, 3 → 12px, 4 → 16px
    shape: { borderRadius: 4 },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.02em" },
      h2: { fontWeight: 800, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontWeight: 700, letterSpacing: "-0.01em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiCard: {
        defaultProps: { variant: "outlined" },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiTooltip: {
        defaultProps: { arrow: true },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 14 } },
      },
    },
  })
}
