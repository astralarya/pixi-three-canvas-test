import { extend, useApplication } from "@pixi/react";
import {
  Container,
  type GpuTextureSystem,
  Graphics,
  RenderTexture,
  TextureSource,
} from "pixi.js";
import {
  createContext,
  type PropsWithChildren,
  type Ref,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ExternalTexture, type Texture } from "three";
import tunnel from "tunnel-rat";

import { PixiTextureContext } from "./pixi-texture-react-hooks.ts";

extend({ Container });

interface PixiTextureTunnelContextValue {
  tunnel: ReturnType<typeof tunnel>;
}

const PixiTextureTunnelContext =
  createContext<PixiTextureTunnelContextValue | null>(null);

export function PixiTextureTunnelProvider({ children }: PropsWithChildren) {
  return (
    <PixiTextureTunnelContext value={{ tunnel: tunnel() }}>
      {children}
    </PixiTextureTunnelContext>
  );
}

function usePixiTextureTunnelContext() {
  const context = useContext(PixiTextureTunnelContext);
  if (context === null) {
    throw Error(
      "usePixiTextureTunnelContext() must be called within a <PixiTextureTunnelProvider />",
    );
  }
  return context;
}

export function PixiTextureRenderer() {
  const { tunnel } = usePixiTextureTunnelContext();
  return (
    <pixiContainer renderable={false}>
      <tunnel.Out />
    </pixiContainer>
  );
}

export interface PixiTextureProps extends PropsWithChildren {
  ref: Ref<Texture>;
  width?: number;
  height?: number;
}

export function PixiTexture({
  ref,
  children,
  width,
  height,
}: PixiTextureProps) {
  const { tunnel } = usePixiTextureTunnelContext();
  const key = useId();
  return (
    <tunnel.In>
      <PixiTextureInternal key={key} ref={ref} width={width} height={height}>
        {children}
      </PixiTextureInternal>
    </tunnel.In>
  );
}

function PixiTextureInternal({
  ref,
  children,
  width,
  height,
}: PixiTextureProps) {
  const app = useApplication();
  const containerRef = useRef<Container>(null!);
  const pixiTextureRef = useRef(
    new RenderTexture({
      dynamic: true,
      source: new TextureSource({ width, height }),
    }),
  );
  const texture = useRef(new ExternalTexture());

  useImperativeHandle(ref, () => {
    return texture.current;
  });

  const [mask, setMask] = useState<Graphics>();

  useLayoutEffect(() => {
    setMask((prev) => {
      const graphics = prev ?? new Graphics();
      graphics.clear();
      graphics
        .rect(
          0,
          0,
          width ?? containerRef.current.width,
          height ?? containerRef.current.height,
        )
        .fill(0xffffff);
      return graphics;
    });
    pixiTextureRef.current.resize(
      width ?? containerRef.current.width,
      height ?? containerRef.current.height,
    );
    const gpuTexture = (
      app.app.renderer.texture as GpuTextureSystem
    ).getGpuSource(pixiTextureRef.current._source);
    texture.current.sourceTexture = gpuTexture;
  }, [app.app.renderer.texture, height, width]);

  function render() {
    app.app.renderer.render({
      container: containerRef.current,
      target: pixiTextureRef.current,
    });
  }

  useEffect(render);

  return (
    <PixiTextureContext value={{ render }}>
      <pixiContainer ref={containerRef} mask={mask}>
        {children}
      </pixiContainer>
    </PixiTextureContext>
  );
}
