import React from "react";

import { useNavigate, useParams } from "react-router";

import { MainGrid } from "../components/MainGrid";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

import {
  RxArrowLeft,
  RxDotsVertical,
  RxListBullet,
  RxExternalLink,
} from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import noFolderRoute from "../assets/svg/no-folder-route.svg";

import { useFolderContext } from "../context/FolderContext";

import { api } from "../services/api";

import type { Folder, Item } from "../types/Folder";

export const FolderPage = () => {
  const { folders, setFolders, loading } = useFolderContext();
  const { folderId } = useParams();

  const folder: Folder | undefined = folders.find(
    (item) => item.id === folderId
  );

  const navigate = useNavigate();

  const handleCheckItemList = async (item: Item) => {
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
    <MainGrid>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CgSpinner className="animate-spin" size={75} color="#7f56d9" />
        </div>
      ) : (
        <React.Fragment>
          {folder ? (
            <div className="flex flex-col gap-4">
              <header className="flex justify-between gap-4">
                <Avatar onClick={() => navigate("../")}>
                  <RxArrowLeft color="#7f56d9" size={16} strokeWidth=".75" />
                </Avatar>
                <Avatar>
                  <RxDotsVertical color="#7f56d9" size={16} strokeWidth=".75" />
                </Avatar>
              </header>

              <h1 className="font-bold text-2xl text-gray-700">
                {folder.title}
              </h1>

              {folder.description && (
                <h2 className="font-medium text-sm text-gray-500">
                  {folder.description}
                </h2>
              )}

              <div className="flex items-center gap-1">
                <RxListBullet color="#667085" />
                <span className="font-normal text-sm text-gray-500">
                  {folder.items.filter((item) => item.checked).length}/
                  {folder.items.length} itens completos
                </span>
              </div>

              {folder.items.length >= 1 ? (
                <React.Fragment>
                  <div className="flex flex-col gap-3">
                    {folder.items.map((item) => (
                      <Card
                        styles={item.checked ? "colored" : "soft"}
                        key={item.id}
                        data-checked={item.checked}
                      >
                        <div className="flex gap-2 items-center justify-between w-full">
                          <div className="flex items-center gap-2 w-[90%]">
                            <input
                              type="checkbox"
                              id={`checkbox-${item.id}`}
                              checked={item.checked}
                              onChange={() => handleCheckItemList(item)}
                              className=" relative peer shrink-0 appearance-none w-4 h-4 border-[1px] border-gray-300 rounded-sm bg-white checked:bg-primary-50 checked:border-primary-600"
                            />
                            <label
                              htmlFor={`checkbox-${item.id}`}
                              className={`font-normal text-sm text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap ${
                                item.checked
                                  ? "line-through text-primary-600"
                                  : ""
                              }`}
                            >
                              Checked state
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

                          {item.link && (
                            <a href={item.link} target="_blank">
                              <RxExternalLink
                                size={16}
                                strokeWidth=".5"
                                color={item.checked ? "#7f56d9" : "#667085"}
                              />
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button>Adicionar novo item</Button>
                </React.Fragment>
              ) : (
                <h1>lista vazia</h1>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <Card styles="outline" flex="center" style={{ width: "360px" }}>
                <img src={noFolderRoute} alt="" width={300} />

                <div className="text-center">
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Pasta não encontrada
                  </h1>
                  <h2 className="text-sm font-medium text-gray-500">
                    Parece que a pasta que você está tentando acessar não
                    existe, retorne à página inicial e tente novamente
                  </h2>
                </div>

                <Button onClick={() => navigate("../")}>Voltar</Button>
              </Card>
            </div>
          )}
        </React.Fragment>
      )}
    </MainGrid>
  );
};
