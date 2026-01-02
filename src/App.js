import React from "react";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import Login from "./components/main/Login";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/main/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/admin-theme.css";

import Group from "./components/pages/Group";
import GroupView from "./components/pages/GroupView";
import MessageTemplate from "./components/pages/MessageTemplate";
import Whatsapp from "./components/pages/Whatsapp";
import WhatsappGroup from "./components/pages/WhatsappGroup";
import ExcelUpload from "./components/pages/ExcelMessage";


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
         <Route path="/whatsapp" element={<Whatsapp/>}/>
         <Route path="/excel/upload" element={<ExcelUpload/>}/>
         <Route path="/whatsap/groups" element={<WhatsappGroup/>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
