import { Outlet } from "react-router-dom";
import "./Layout.scss";
import { Header } from "../Header/Header";

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
