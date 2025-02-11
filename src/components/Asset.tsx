import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useConfiguratorStore } from "../store";
import * as THREE from "three";

export const Asset = ({
  url,
  categoryName,
  skeleton
}: {
  url: string;
  categoryName: string;
  skeleton: THREE.Skeleton;
}) => {
  const gltf = useGLTF(url);
  const scene = gltf.scene;

  const customization = useConfiguratorStore((state) => state.customization);
  const lockedGroups = useConfiguratorStore((state) => state.lockedGroups);

  const assetColor = customization[categoryName].color;

  const skin = useConfiguratorStore((state) => state.skin);

  useEffect(() => {
    scene.traverse((child) => {
      // @ts-ignore
      if (child.isMesh) {
        // @ts-ignore
        if (child.material && 'name' in child.material && child.material.name.includes("Color_")) {
          // @ts-ignore
          child.material.color.set(assetColor);
        }
      }
    });
  }, [assetColor, scene]);

  const attachedItems = useMemo(() => {
    const items: {
      geometry: THREE.BufferGeometry;
      material: THREE.Material;
      morphTargetDictionary: Record<string, number>;
      morphTargetInfluences: number[];
    }[] = [];

    scene.traverse((child) => {
      // @ts-ignore
      if (child.isMesh) {
        // @ts-ignore
        items.push({
          // @ts-ignore
          geometry: child.geometry,
          // @ts-ignore
          material: child.material.name.includes("Skin_")
            ? skin
            // @ts-ignore
            : child.material,
          // @ts-ignore
          morphTargetDictionary: child.morphTargetDictionary,
          // @ts-ignore
          morphTargetInfluences: child.morphTargetInfluences,
        });
      }
    });
    return items;
  }, [scene]);

  if (lockedGroups[categoryName]) {
    return null;
  }

  return attachedItems.map((item, index) => (
    <skinnedMesh
      key={index}
      geometry={item.geometry}
      material={item.material}
      skeleton={skeleton}
      morphTargetDictionary={item.morphTargetDictionary}
      morphTargetInfluences={item.morphTargetInfluences}
      castShadow
      receiveShadow
    />
  ));
};
