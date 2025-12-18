import { useState } from "react";
import { PixiThreeCanvas } from "./components/pixi-three-canvas";
import { SpinnyCube } from "./components/spinny-cube";

function App() {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <h1 className="text-2xl">Pixi + Three</h1>
      <div className="flex items-center gap-4">
        <button
          className="bg-neutral-500 p-2 rounded-sm"
          onClick={() => setToggle((x) => !x)}
        >
          Toggle canvas
        </button>
        <span>Canvas is {toggle ? "mounted" : "unmounted"}</span>
      </div>
      {toggle && (
        <PixiThreeCanvas className="w-[80lvw] h-[80lvh]">
          <SpinnyCube />
        </PixiThreeCanvas>
      )}
    </>
  );
}

export default App;
