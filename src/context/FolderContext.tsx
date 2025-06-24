import { createContext, useContext, useState, type ReactNode } from "react";

import type { Folder } from "../types/Folder";

interface FolderContextProps {
  listId: string;
  setListId: React.Dispatch<React.SetStateAction<string>>;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [listId, setListId] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <FolderContext.Provider
      value={{
        listId,
        setListId,
        folders,
        setFolders,
        loading,
        setLoading,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFolderContext = () => {
  const context = useContext(FolderContext);

  if (!context) {
    throw new Error(
      "useFolderContext deve ser usado dentro de um FolderProvider"
    );
  }

  return context;
};
