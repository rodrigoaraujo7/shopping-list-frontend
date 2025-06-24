import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Folder, List } from "../types/List";
import { api } from "../services/api";

interface ListContextProps {
  avaliableListIds: string[];
  setAvaliableListIds: React.Dispatch<React.SetStateAction<string[]>>;
  listId: string;
  setListId: React.Dispatch<React.SetStateAction<string>>;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListContext = createContext<ListContextProps | undefined>(undefined);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [avaliableListIds, setAvaliableListIds] = useState<string[]>([]);
  const [listId, setListId] = useState<string>("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchList = async () => {
    try {
      const { data } = await api.get<List[]>("/lists");

      setAvaliableListIds(data.map((list) => list.id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    console.log(avaliableListIds);
  }, []);

  return (
    <ListContext.Provider
      value={{
        avaliableListIds,
        setAvaliableListIds,
        listId,
        setListId,
        folders,
        setFolders,
        loading,
        setLoading,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useListContext = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error("useListContext deve ser usado dentro de um ListProvider");
  }

  return context;
};
