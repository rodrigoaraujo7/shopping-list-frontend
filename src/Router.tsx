import { useLocation, Routes, Route, Outlet } from "react-router";

import { AnimatePresence } from "motion/react";

import { FolderProvider } from "./context/FolderContext.tsx";

import { FolderPage } from "./pages/Folder.tsx";
import { ListPage } from "./pages/List.tsx";

const FolderLayout = () => (
  <FolderProvider>
    <Outlet />
  </FolderProvider>
);

export const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<h1>Index</h1>} />

        <Route path="/:listId" element={<FolderLayout />}>
          <Route index element={<ListPage />} />

          <Route path="/:listId/:folderId" element={<FolderPage />} />
        </Route>

        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </AnimatePresence>
  );
};
