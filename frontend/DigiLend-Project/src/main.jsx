import React from "react";
import ReactDOM from "react-dom/client";
import { AnimatePresence } from "framer-motion";
import App from "./App.jsx";
import "./index.css";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<MainPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <AnimatePresence exitBeforeEnter>
        <Route />
      </AnimatePresence>
    </RouterProvider>
  </React.StrictMode>
);
