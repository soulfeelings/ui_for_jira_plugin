import { NodeIO } from "@gltf-transform/core";
import { dedup, draco, prune, quantize } from "@gltf-transform/functions";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { GLTFExporter } from "three-stdlib";
import { pb, useConfiguratorStore } from "../store";
import { Asset } from "./Asset";
import { Group } from "three";
import { Object3DEventMap } from "three";

export const Avatar = ({ ...props }) => {
  const group = useRef<Group<Object3DEventMap>>(null);
  const { nodes } = useGLTF("/models/Armature.glb");
  // const { animations } = useGLTF("/models/Poses.glb");
  const customization = useConfiguratorStore((state) => state.customization);
  // const { actions } = useAnimations(animations, group);
  // const setDownload = useConfiguratorStore((state) => state.setDownload);

  // const pose = useConfiguratorStore((state) => state.pose);

  // useEffect(() => {
  //   function download() {
  //     const exporter = new GLTFExporter();

  //     if (!group.current) return;

  //     exporter.parse(
  //       group.current,
  //       // @ts-ignore
  //       async function (result: ArrayBuffer) {
  //         const io = new NodeIO();

  //         // Read.
  //         const document = await io.readBinary(new Uint8Array(result)); // Uint8Array → Document
  //         await document.transform(
  //           // Remove unused nodes, textures, or other data.
  //           prune(),
  //           // Remove duplicate vertex or texture data, if any.
  //           dedup(),
  //           // Compress mesh geometry with Draco.
  //           draco(),
  //           // Quantize mesh geometry.
  //           quantize()
  //         );

  //         // Write.
  //         const glb = await io.writeBinary(document); // Document → Uint8Array

  //         save(
  //           new Blob([glb], { type: "application/octet-stream" }),
  //           `avatar_${+new Date()}.glb`
  //         );
  //       },
  //       function (error) {
  //         console.error(error);
  //       },
  //       { binary: true }
  //     );
  //   }

  //   const link = document.createElement("a");
  //   link.style.display = "none";
  //   document.body.appendChild(link); // Firefox workaround, see #6594

  //   function save(blob: Blob, filename: string) {
  //     link.href = URL.createObjectURL(blob);
  //     link.download = filename;
  //     link.click();
  //   }
  //   setDownload(download);
  // }, []);

  // useEffect(() => {
  //   if (!actions[pose]) return;
  //   const action = actions[pose].fadeIn(0.2).play();
  //   return () => {
  //     action.fadeOut(0.2);
  //     action.stop();
  //   };
  // }, [actions, pose]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          {Object.keys(customization).map(
            (key) =>
              customization[key]?.asset?.file && (
                <Suspense key={customization[key].asset.id}>
                  <Asset
                    categoryName={key}
                    url={pb.files.getUrl(
                      customization[key].asset,
                      customization[key].asset.file
                    )}
                    // @ts-ignore
                    skeleton={nodes.Plane.skeleton}
                  />
                </Suspense>
              )
          )}
        </group>
      </group>
    </group>
  );
};
