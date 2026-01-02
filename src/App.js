import React from "react";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import Login from "./components/main/Login";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/main/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Clients from "./components/pages/Clients";
import "./styles/admin-theme.css";
import Plans from "./components/pages/Plans";
import View from "./components/pages/View";
import PlanView from "./components/pages/PlanView";
import Group from "./components/pages/Group";
import GroupView from "./components/pages/GroupView";
import MessageTemplate from "./components/pages/MessageTemplate";


const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Route */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/groups" element={<Group />} />
          <Route path="/groups/view/:id" element={<GroupView />} />
         <Route path="/message/template" element={<MessageTemplate/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
