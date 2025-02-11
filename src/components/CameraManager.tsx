import { CameraControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { useEffect, useRef } from "react";
import { useConfiguratorStore } from "../store.ts";
import { UI_MODES } from "../store_types.ts";
import { Vector3 } from "three";

const MODE_CAMERA_POSITIONS = {
  [UI_MODES.CUSTOMIZE]: { start: [2, 0, 10], target: [2, 0, 0] },
  [UI_MODES.LEVEL]: { start: [2, 0, 10], target: [2, 0, 0] },
}

export const DEFAULT_CAMERA_POSITION = [-1, 1, 5];
export const DEFAULT_CAMERA_TARGET = [2, 0, 0];


export const CameraManager = ({ loading }: { loading: boolean }) => {
  const controls = useRef<CameraControls | null>(null);
  const currentCategory = useConfiguratorStore(
    (state) => state.currentCategory
  );
  const initialLoading = useConfiguratorStore((state) => state.loading);
  const mode = useConfiguratorStore((state) => state.mode);
  useControls({
    getCameraPosition: button(() => {
      if (!controls.current) {
        console.warn('Controls not initialized');
        return;
      }
      const position = new Vector3();
      controls.current.getPosition(position);
      console.log("Camera Position:", position);
    }),
    getCameraTarget: button(() => {
      if (!controls.current) {
        console.warn('Controls not initialized');
        return;
      }
      const target = new Vector3();
      controls.current.getTarget(target);
      console.log("Camera Target:", target);
    }),
  });

  useEffect(() => {
    if (!controls.current) return;

    if (initialLoading) {
      // controls.current.setLookAt(
      //   START_CAMERA_POSITION[0],
      //   START_CAMERA_POSITION[1],
      //   START_CAMERA_POSITION[2],
      //   DEFAULT_CAMERA_TARGET[0],
      //   DEFAULT_CAMERA_TARGET[1],
      //   DEFAULT_CAMERA_TARGET[2]
      // );
    } else if (
      !loading &&
      mode === UI_MODES.CUSTOMIZE
      // currentCategory?.expand?.cameraPlacement
    ) {
      // controls.current.setLookAt(
      //   ...currentCategory.expand.cameraPlacement.position,
      //   ...currentCategory.expand.cameraPlacement.target,
      //   true
      // );
    } else if (
      !loading &&
      mode === UI_MODES.LEVEL
    ) {
      controls.current.setLookAt(
        MODE_CAMERA_POSITIONS[mode].start[0],
        MODE_CAMERA_POSITIONS[mode].start[1],
        MODE_CAMERA_POSITIONS[mode].start[2],
        MODE_CAMERA_POSITIONS[mode].target[0],
        MODE_CAMERA_POSITIONS[mode].target[1],
        MODE_CAMERA_POSITIONS[mode].target[2],
        true
      );
    } else {
      controls.current.setLookAt(
        DEFAULT_CAMERA_POSITION[0],
        DEFAULT_CAMERA_POSITION[1],
        DEFAULT_CAMERA_POSITION[2],
        DEFAULT_CAMERA_TARGET[0],
        DEFAULT_CAMERA_TARGET[1],
        DEFAULT_CAMERA_TARGET[2],
        true
      );
    }
  }, [currentCategory, mode, initialLoading, loading]);

  return (
    // allow dev mode to manage camera
    <CameraControls
      ref={controls}
      // enabled={mode !== UI_MODES.LEVEL}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minDistance={2}
      maxDistance={8}
    />
  );
};
