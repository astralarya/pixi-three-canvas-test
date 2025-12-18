import { useState } from "react";
import { PixiThreeCanvas } from "./components/pixi-three-canvas";
import { SpinnyCube } from "./components/spinny-cube";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-lg">Pixi + Three</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <PixiThreeCanvas className="w-[80lvw] h-[80lvh]">
          <SpinnyCube />
        </PixiThreeCanvas>
      </div>
    </>
  );
}

export default App;
