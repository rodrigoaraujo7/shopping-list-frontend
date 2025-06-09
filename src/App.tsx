import { Card } from "./components/Card";

function App() {
  return (
    <main className="min-h-screen grid grid-cols-[1fr] md:grid-cols-[1fr_768px_1fr]">
      <div className="col-auto p-4 md:col-start-2 md:col-end-3">
        <div className="flex justify-center items-center h-full">
          <Card styles="outline" flex="center">
            <h1>Teste card</h1>
            <h1>Teste card</h1>
            <h1>Teste card</h1>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default App;
