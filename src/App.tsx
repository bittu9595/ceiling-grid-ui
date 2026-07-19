import { useEffect } from "react";
import { AppRoutes } from "./routes";
import "./styles/global.scss";
import { useAppStore } from "./store";

/*
 * Renders the root application shell.
 * Syncs the active theme with the document root.
 */
export default function App() {
  const theme = useAppStore((state) => state.ui.theme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <AppRoutes />;
}
