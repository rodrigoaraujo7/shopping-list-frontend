import { useState } from "react";

import { useParams } from "react-router";

import { Button } from "../Button";
import { Modal } from "../Modal";

import deleteItem from "../assets/svg/delete-item.svg";

import { useFolderContext } from "../../context/FolderContext";

import { api } from "../../services/api";

import type { Item } from "../../types/Folder";

export const DeleteItemModal = ({
  onClose,
  selectedItem,
}: {
  onClose: () => void;
  selectedItem: Item | undefined;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const handleDelete = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      await api.delete("/item", {
        params: {
          id: selectedItem?.id,
        },
      });

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.filter((i) => i.id !== selectedItem?.id),
              }
            : folder
        )
      );

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal title="Deletar item" onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[360px]">
          <img src={deleteItem} alt="" width={300} />

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Essa ação é irreversível
            </h1>
            <h2 className="text-sm font-medium text-gray-500">
              Tem certeza que deseja deletar esse item?
            </h2>
          </div>

          <Button isFetching={isFetching} onClick={handleDelete}>
            Deletar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
