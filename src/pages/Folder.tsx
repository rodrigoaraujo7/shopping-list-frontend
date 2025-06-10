import { useParams } from "react-router";
import { MainGrid } from "../components/MainGrid";

export const FolderPage = () => {
  const { folderId } = useParams();

  return (
    <MainGrid>
      <h1>{folderId}</h1>
    </MainGrid>
  );
};
