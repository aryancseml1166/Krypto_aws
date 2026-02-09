import React, { useEffect, useState } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";

function Header() {

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "dark"
  );

  // ✅ CHECK LOGIN STATUS
  const isLoggedIn = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (localStorage.getItem("theme") == "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") != "dark") {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  return (
    <div className="header">
      <h1>
        CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
      </h1>

      <div className="links">

        <Switch checked={darkMode} onClick={changeMode} />

        <a href="/">
          <p className="link">Home</p>
        </a>

        {/* ✅ IF USER LOGGED IN */}
        {isLoggedIn ? (
          <>
            <a href="/compare">
              <p className="link">Compare</p>
            </a>

            <a href="/watchlist">
              <p className="link">Watchlist</p>
            </a>

            <a href="/dashboard">
              <Button text={"Dashboard"} />
            </a>

            <p className="link" onClick={logout}>
              Logout
            </p>
          </>
        ) : (
          <>
            {/* ✅ IF USER NOT LOGGED IN */}
            <a href="/login">
              <p className="link">Login</p>
            </a>

            <a href="/register">
              <Button text={"Signup"} />
            </a>
          </>
        )}

      </div>

      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
