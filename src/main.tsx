import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";

import { Flip, ToastContainer } from "react-toastify";

import { FolderProvider } from "./context/FolderContext.tsx";

import { Router } from "./Router.tsx";

import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FolderProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
    </FolderProvider>
  </StrictMode>
);
