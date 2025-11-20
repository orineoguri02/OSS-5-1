import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import UserManagement from "./components/Pages/UserManagement";

const myComponent = <UserManagement />;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(myComponent);
