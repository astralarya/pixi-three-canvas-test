import { Application } from "@pixi/react";
import { useRef, type PropsWithChildren } from "react";

import {
  PixiTextureRenderer,
  PixiTextureTunnelProvider,
} from "./pixi-texture-react";
import { ThreeRoot } from "./three-root";
import { ThreeSceneRenderer, ThreeSceneTunnelProvider } from "./three-scene";

export interface GameCanvasProps extends PropsWithChildren {
  className?: string;
}

export function PixiThreeCanvas({ children, className }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`${className} relative touch-none overflow-clip`}
    >
      <PixiTextureTunnelProvider>
        <ThreeSceneTunnelProvider>
          <Application
            resizeTo={containerRef}
            backgroundAlpha={0}
            preference="webgpu"
            resolution={2}
          >
            <PixiTextureRenderer />
            <ThreeRoot>
              <ThreeSceneRenderer />
            </ThreeRoot>
            {children}
          </Application>
        </ThreeSceneTunnelProvider>
      </PixiTextureTunnelProvider>
    </div>
  );
}
