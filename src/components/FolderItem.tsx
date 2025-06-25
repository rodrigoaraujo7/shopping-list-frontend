import React, { useState, type ComponentProps } from "react";

import { useParams } from "react-router";

import { AnimatePresence, type MotionProps } from "motion/react";

import { Card } from "../components/Card";
import { DeleteItemModal } from "./modals/DeleteItemModal";
import { EditItemModal } from "./modals/EditItemModal";

import { RxExternalLink, RxPencil1, RxTrash } from "react-icons/rx";

import { useFolderContext } from "../context/FolderContext";

import { api } from "../services/api";

import type { Item } from "../types/List";

type FolderItemProps = ComponentProps<"div"> &
  MotionProps & {
    item: Item;
  };

export const FolderItem = ({ item, ...props }: FolderItemProps) => {
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
        {...props}
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
          <EditItemModal
            onClose={() => setEditItemModal(false)}
            selectedItem={selectedItem}
          />
        )}

        {deleteItemModal && (
          <DeleteItemModal
            onClose={() => setDeleteItemModal(false)}
            selectedItem={selectedItem}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};
