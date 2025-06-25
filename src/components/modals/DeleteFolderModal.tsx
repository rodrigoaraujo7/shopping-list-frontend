import { useState } from "react";

import { useNavigate, useParams } from "react-router";

import { toast } from "react-toastify";

import { Button } from "../Button";
import { Modal } from "../Modal";

import deleteFolder from "../../assets/svg/delete-folder.svg";

import { useFolderContext } from "../../context/FolderContext";

import { api } from "../../services/api";

export const DeleteFolderModal = ({ onClose }: { onClose: () => void }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { listId, setFolders } = useFolderContext();

  const navigate = useNavigate();
  const { folderId } = useParams();

  const handleDelete = async () => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      await api.delete("/folder", {
        params: {
          id: folderId,
        },
      });

      setFolders((prevFolders) =>
        prevFolders.filter((pv) => pv.id !== folderId)
      );

      navigate(`/${listId}`);
      toast.success("Pasta deletada com sucesso!");
    } catch (error) {
      console.log(error);
      toast.success("Erro ao deletar pasta!");
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Modal title="Deletar pasta" onClose={onClose}>
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col gap-4 w-[360px]">
          <img src={deleteFolder} alt="" width={300} />

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Essa ação é irreversível
            </h1>
            <h2 className="text-sm font-medium text-gray-500">
              Tem certeza que deseja deletar essa pasta?
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
