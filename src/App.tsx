import { useState } from "react";
import { PixiThreeCanvas } from "./components/pixi-three-canvas";
import { SpinnyCube } from "./components/spinny-cube";

function App() {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <div className="bg-neutral-300 p-4">
        <h1 className="text-2xl">Pixi + Three</h1>
        <div className="mt-2 flex items-center gap-4">
          <button
            className="bg-amber-500 hover:bg-amber-400 cursor-pointer p-2 rounded-sm"
            onClick={() => setToggle((x) => !x)}
          >
            Toggle canvas
          </button>
          <span>Canvas is {toggle ? "mounted" : "unmounted"}</span>
        </div>
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
