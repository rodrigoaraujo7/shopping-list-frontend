import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router";

import { FolderProvider } from "./context/FolderContext.tsx";

import App from "./App.tsx";

import "./global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FolderProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<App />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </BrowserRouter>
    </FolderProvider>
  </StrictMode>
);
