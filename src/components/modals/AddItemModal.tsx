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

export const AddItemModal = ({ onClose }: { onClose: () => void }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddItemFormData>({
    resolver: zodResolver(AddItemFormSchema),
  });

  const onSubmit = async (data: AddItemFormData) => {
    if (isFetching) return;

    try {
      setIsFetching(true);

      const response = await api.post("/item", {
        name: data.name,
        link: data.link,
        folderId,
      });

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: [...folder.items, response.data],
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
    <Modal title="Adicionar novo item" onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input
          id="name"
          label="Nome do item"
          placeholder="-"
          {...register("name")}
          styles={errors.name && "error"}
        />

        <Input id="link" label="Link" placeholder="-" {...register("link")} />

        <Button isFetching={isFetching}>Criar</Button>
      </form>
    </Modal>
  );
};
