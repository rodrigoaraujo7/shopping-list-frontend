import { useLocation, Routes, Route } from "react-router";

import { AnimatePresence } from "motion/react";

import { FolderPage } from "./pages/Folder.tsx";
import { ListPage } from "./pages/List.tsx";

import "./global.css";

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<h1>Index</h1>} />

        <Route path="/:listId" element={<ListPage />} />

        <Route path="/:listId/:folderId" element={<FolderPage />} />

        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </AnimatePresence>
  );
};
