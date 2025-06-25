import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import axios from "axios";

import { api } from "../services/api";

import type { Folder } from "../types/List";

import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router";

interface FolderContextProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  listId: string;
  setListId: React.Dispatch<React.SetStateAction<string>>;
}

const FolderContext = createContext<FolderContextProps | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [listId, setListId] = useState<string>("");

  const { listId: id } = useParams();

  const navigate = useNavigate();

  const fetchFolders = async (paramListId: string) => {
    setLoading(true);

    try {
      const { data } = await api.get("/folders", {
        params: {
          listId: paramListId,
        },
      });

      setListId(paramListId);
      setFolders(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Essa lista não existe!");
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchFolders(id);
  }, []);

  return (
    <FolderContext.Provider
      value={{
        loading,
        setLoading,
        folders,
        setFolders,
        listId,
        setListId,
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
