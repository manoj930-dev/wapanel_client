import React, { useEffect, useState } from "react";

const Navs = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className="navbar navbar-custom fixed-top px-3 d-flex justify-content-between">
      
      {/* LEFT */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="navbar-toggler d-md-none"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <span className="navbar-brand fw-bold brand-logo">
          Wapanel_v2
        </span>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-3">
        <span>{currentTime.toLocaleTimeString()}</span>
        <i
          className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"} theme-toggle`}
          onClick={toggleTheme}
          title="Toggle theme"
        ></i>
        <i className="bi bi-person-circle fs-4"></i>
      </div>
    </nav>
  );
};

export default Navs;
