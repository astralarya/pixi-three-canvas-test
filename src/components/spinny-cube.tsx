import { useEffect, useRef, useState } from "react";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { ExternalTexture, Material, type Mesh } from "three";
import { texture, uv } from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { PixiTexture } from "./pixi-texture";
import { Graphics } from "pixi.js";
import { extend, useTick } from "@pixi/react";

import { usePixiTextureContext } from "./pixi-texture-context";

extend({ Graphics });

export function SpinnyCube(props: ThreeElements["mesh"]) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current!.rotation.x += delta));

  const pixiTexture = useRef(new ExternalTexture());
  const [material, setMaterial] = useState<Material>();

  useEffect(() => {
    setMaterial(() => {
      const material = new MeshBasicNodeMaterial();
      material.colorNode = texture(pixiTexture.current, uv());
      return material;
    });
  }, []);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
      material={material}
    >
      <boxGeometry args={[1, 1, 1]} />
      <PixiTexture ref={pixiTexture}>
        <SpinnyCubeTexture />
      </PixiTexture>
    </mesh>
  );
}

function SpinnyCubeTexture() {
  const { render } = usePixiTextureContext();
  const star = useRef<Graphics>(null!);
  const time = useRef(0);

  useTick((ticker) => {
    time.current += ticker.deltaMS;
    star.current.rotation = ((time.current % 2000) / 2000) * 2 * Math.PI;
    render();
  });

  function drawBackground(graphics: Graphics) {
    graphics.clear();
    graphics.rect(0, 0, 64, 64).fill(0x000000);
  }

  function drawStar(graphics: Graphics) {
    graphics.clear();
    graphics.star(32, 32, 5, 16).stroke({ width: 4, color: 0xffffff });
  }

  return (
    <>
      <pixiGraphics draw={drawBackground} />
      <pixiGraphics ref={star} draw={drawStar} origin={32} />
    </>
  );
}
