import { Card } from "./components/Card";
import { useFolderContext } from "./context/FolderContext";

import noData from "./assets/svg/no-data.svg";
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";

function App() {
  const { folders } = useFolderContext();

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_768px_1fr]">
      <div className="col-auto p-4 md:col-start-2 md:col-end-3">
        {folders.length <= 0 ? (
          <div className="flex justify-center items-center h-full">
            <Card styles="outline" flex="center" style={{ width: "360px" }}>
              <img src={noData} alt="" width={300} />

              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Comece criando uma pasta
                </h1>
                <h2 className="text-sm font-medium text-gray-500">
                  Sua lista de compras inteligente será exibida aqui. Comece
                  criando uma nova pasta
                </h2>
              </div>

              <Button>Adicionar nova pasta</Button>
            </Card>
          </div>
        ) : (
          <div className="flex h-full">
            {folders.map((folder) => (
              <Card key={folder.id}>{folder.title}</Card>
            ))}
          </div>
        )}

        <Modal
          title="Adicionar nova pasta"
          onClose={() => console.log()}
        ></Modal>
      </div>
    </main>
  );
}

export default App;
