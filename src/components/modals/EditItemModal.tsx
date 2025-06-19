import { useState } from "react";

import { useParams } from "react-router";

import { Button } from "../Button";
import { Modal } from "../Modal";
import { Input } from "../Input";

import { useForm } from "react-hook-form";
import {
  AddItemFormSchema,
  type AddItemFormData,
} from "../../types/zod/add-item-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useFolderContext } from "../../context/FolderContext";

import { api } from "../../services/api";

import type { Item } from "../../types/Folder";

export const EditItemModal = ({
  onClose,
  selectedItem,
}: {
  onClose: () => void;
  selectedItem: Item | undefined;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(AddItemFormSchema),
    defaultValues: {
      name: selectedItem?.name,
      link: selectedItem?.link,
    },
  });

  const onSubmit = async (data: AddItemFormData) => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const response = await api.put(
        "/item",
        {
          ...selectedItem,
          name: data.name,
          link: data.link,
        },
        {
          params: {
            id: selectedItem?.id,
          },
        }
      );

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.map((i) =>
                  i.id === selectedItem?.id ? response.data : i
                ),
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
    <Modal title="Atualizar item" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome do item"
          placeholder="-"
          {...register("name")}
          defaultValue={selectedItem?.name}
          styles={errors.name && "error"}
        />

        <Input
          id="link"
          label="Link"
          placeholder="-"
          {...register("link")}
          defaultValue={selectedItem?.link}
        />

        <Button isFetching={isFetching}>Salvar</Button>
      </form>
    </Modal>
  );
};
