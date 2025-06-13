import React, { useState } from "react";

import { useParams } from "react-router";

import { AnimatePresence } from "motion/react";

import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";

import { RxExternalLink, RxPencil1, RxTrash } from "react-icons/rx";

import { useForm } from "react-hook-form";
import {
  AddItemFormSchema,
  type AddItemFormData,
} from "../types/zod/add-item-form";
import { zodResolver } from "@hookform/resolvers/zod";

import deleteItem from "../assets/svg/delete-item.svg";

import { useFolderContext } from "../context/FolderContext";

import { api } from "../services/api";

import type { Item } from "../types/Folder";

type FolderItemProps = {
  item: Item;
};

export const FolderItem = ({ item }: FolderItemProps) => {
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [editItemModal, setEditItemModal] = useState<boolean>(false);
  const [deleteItemModal, setDeleteItemModal] = useState<boolean>(false);

  const { setFolders } = useFolderContext();

  const { folderId } = useParams();

  const handleCheckItemList = async () => {
    try {
      const updatedItem = {
        ...item,
        checked: !item.checked,
      };

      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                items: folder.items.map((i) =>
                  i.id === item.id ? updatedItem : i
                ),
              }
            : folder
        )
      );

      await api.put(`item`, updatedItem, {
        params: { id: item.id },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Card
        styles={item.checked ? "colored" : "soft"}
        key={item.id}
        data-checked={item.checked}
      >
        <div className="flex gap-2 items-center justify-between w-full">
          <div className="flex items-center gap-2 relative w-[68%] md:w-[88%]">
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              checked={item.checked}
              onChange={handleCheckItemList}
              className=" relative peer shrink-0 appearance-none w-4 h-4 border-[1px] border-gray-300 rounded-sm bg-white checked:bg-primary-50 checked:border-primary-600 transition-[.15s]"
            />
            <label
              htmlFor={`checkbox-${item.id}`}
              className={`font-normal text-sm text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap transition-[.15s] ${
                item.checked ? "line-through text-primary-600" : ""
              }`}
            >
              {item.name}
            </label>
            <svg
              className="absolute w-3 h-3 ml-[2px] hidden peer-checked:block pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7f56d9"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <div className="flex gap-2">
            {item.link && (
              <a href={item.link} target="_blank">
                <RxExternalLink
                  size={16}
                  strokeWidth=".5"
                  color={item.checked ? "#7f56d9" : "#667085"}
                />
              </a>
            )}

            <span
              className="cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setEditItemModal(true);
              }}
            >
              <RxPencil1
                size={16}
                strokeWidth=".5"
                color={item.checked ? "#7f56d9" : "#667085"}
              />
            </span>

            <span
              className="cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setDeleteItemModal(true);
              }}
            >
              <RxTrash
                size={16}
                strokeWidth=".5"
                color={item.checked ? "#7f56d9" : "#667085"}
              />
            </span>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {editItemModal && (
          <EditItemForm
            onClose={() => setEditItemModal(false)}
            selectedItem={selectedItem}
          />
        )}

        {deleteItemModal && (
          <DeleteItemForm
            onClose={() => setDeleteItemModal(false)}
            selectedItem={selectedItem}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

const EditItemForm = ({
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

const DeleteItemForm = ({
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
