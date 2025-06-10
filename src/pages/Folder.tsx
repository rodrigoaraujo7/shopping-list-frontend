import React from "react";

import { useNavigate, useParams } from "react-router";

import { MainGrid } from "../components/MainGrid";
import { Avatar } from "../components/Avatar";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

import { RxArrowLeft, RxDotsVertical } from "react-icons/rx";
import { CgSpinner } from "react-icons/cg";

import noFolderRoute from "../assets/svg/no-folder-route.svg";

import { useFolderContext } from "../context/FolderContext";

import type { Folder } from "../types/Folder";

export const FolderPage = () => {
  const { folders, loading } = useFolderContext();
  const { folderId } = useParams();

  const folder: Folder | undefined = folders.find(
    (item) => item.id === folderId
  );

  const navigate = useNavigate();

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

              <h1>{folder?.title}</h1>
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
