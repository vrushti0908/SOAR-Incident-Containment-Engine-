import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-page)",
        filter: darkMode ? "none" : "invert(0.93) hue-rotate(180deg)",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div style={{ padding: "20px 24px", flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}