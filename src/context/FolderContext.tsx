import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";

import type { Folder } from "../types/Folder";

interface FolderContextProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  loading: boolean;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFolders = async () => {
    try {
      const { data } = await api.get("/folders");

      setFolders(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();

    window.scrollTo(0, 1);
  }, []);

  return (
    <FolderContext.Provider
      value={{
        folders,
        setFolders,
        loading,
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
