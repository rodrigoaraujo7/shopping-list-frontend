import { useLocation, Routes, Route } from "react-router";

import { AnimatePresence } from "motion/react";

import { FolderPage } from "./pages/Folder.tsx";
import { App } from "./pages/App.tsx";

import "./global.css";

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<App />} />

        <Route path="/folder/:folderId" element={<FolderPage />} />

        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </AnimatePresence>
  );
};
