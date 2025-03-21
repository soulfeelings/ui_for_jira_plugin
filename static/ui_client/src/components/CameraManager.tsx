import { CameraControls, FlyControls, OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useConfiguratorStore } from "../store.ts";
import { UI_MODES } from "../store_types.ts";
import { button } from "leva";
import { useControls } from "leva";
import { Vector3 } from "three";


const MODE_CAMERA_POSITIONS = {
  desktop: {
    [UI_MODES.CUSTOMIZE]: { start: [2, 0, 10], target: [2, 0, 0] },
    [UI_MODES.LEVEL]: { start: [2, 0, 10], target: [2, 0, 0] },
    [UI_MODES.SHOP]: { start: [-2.8352721771146134, 0.17593017066925046, 3.784070764173101], target: [2, 0, 0] },
  },
  mobile: {
    [UI_MODES.CUSTOMIZE]: { start: [0, 0, 10], target: [0, 0, 0] },
    [UI_MODES.LEVEL]: { start: [0, 1, 8], target: [0, 1, 0] },
    [UI_MODES.SHOP]: { start: [0, 1, 8], target: [0, 1, 0] },
  }
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
  const isMobile = useConfiguratorStore((state) => state.isMobile);

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

    if (isMobile) {
      controls.current.setLookAt(
        MODE_CAMERA_POSITIONS.mobile[mode].start[0],
        MODE_CAMERA_POSITIONS.mobile[mode].start[1],
        MODE_CAMERA_POSITIONS.mobile[mode].start[2],
        MODE_CAMERA_POSITIONS.mobile[mode].target[0],
        MODE_CAMERA_POSITIONS.mobile[mode].target[1],
        MODE_CAMERA_POSITIONS.mobile[mode].target[2],
        true
      );
      return;
    }

    if (
      !loading &&
      mode === UI_MODES.SHOP &&
      currentCategory?.cameraPlacementJSON
      // TODO: make change camera view when change category
    ) {
      controls.current.setLookAt(
        currentCategory.cameraPlacementJSON.start.x,
        currentCategory.cameraPlacementJSON.start.y,
        currentCategory.cameraPlacementJSON.start.z,
        currentCategory.cameraPlacementJSON.target.x,
        currentCategory.cameraPlacementJSON.target.y,
        currentCategory.cameraPlacementJSON.target.z,
        true
      );
    } else {
      controls.current.setLookAt(
        MODE_CAMERA_POSITIONS.desktop[mode].start[0],
        MODE_CAMERA_POSITIONS.desktop[mode].start[1],
        MODE_CAMERA_POSITIONS.desktop[mode].start[2],
        MODE_CAMERA_POSITIONS.desktop[mode].target[0],
        MODE_CAMERA_POSITIONS.desktop[mode].target[1],
        MODE_CAMERA_POSITIONS.desktop[mode].target[2],
        true
      );
    }

    // for debug
    // @ts-ignore
    window.controls = controls.current;
  }, [currentCategory, mode, initialLoading, loading, isMobile]);

  return (

    <CameraControls
      ref={controls}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minDistance={2}
      maxDistance={8}
    />
  );
};
