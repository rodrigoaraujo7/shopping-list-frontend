import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router";

import { Flip, ToastContainer } from "react-toastify";

import { ListProvider } from "./context/ListContext.tsx";

import { Router } from "./Router.tsx";

import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ListProvider>
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
    </ListProvider>
  </StrictMode>
);
