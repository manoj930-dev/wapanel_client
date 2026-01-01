import React from "react";
import { NavLink } from "react-router-dom";

const Headers = () => {
  return (
    <>
      {/* MOBILE OFFCANVAS */}
      <div
        className="offcanvas offcanvas-start d-md-none"
        style={{ background: "var(--sidebar-bg)", color: "var(--text-main)" }}
        tabIndex="-1"
        id="sidebar"
      >
        <div className="offcanvas-header">
          <h5>Admin Menu</h5>
          <button
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body p-0">
          <SidebarContent />
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div
        className="d-none d-md-block sidebar-desktop"
        style={{ background: "var(--sidebar-bg)", color: "var(--text-main)" }}
      >
        <SidebarContent />
      </div>
    </>
  );
};

const SidebarContent = () => {
  const role = localStorage.getItem("adminRole");
  return (
    <ul className="nav flex-column p-3">
      <li className="nav-item">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Dashboard
        </NavLink>
      </li>
      {role === "superadmin" && (
        <>
          <li className="nav-item">
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Users
            </NavLink>
          </li>
        </>
      )}
      <li className="nav-item">
        <NavLink
          to="/plans"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Plans
        </NavLink>
      </li>
    </ul>
  );
};

export default Headers;
