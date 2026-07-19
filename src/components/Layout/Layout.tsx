import { Outlet } from "react-router-dom";
import "./Layout.scss";
import { Header } from "../Header/Header";

/*
 * Wraps the routed page content with the shared header layout.
 * Provides the main shell for nested application pages.
 */
export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
