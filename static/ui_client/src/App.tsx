import { Canvas, Vector3 } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager.js";
import { Experience } from "./components/Experience.jsx";
import { UI } from "./components/UI.jsx";
import { useConfiguratorStore } from "./store.js";
import { CharacterNameForm } from "./components/CharacterNameForm.js";
import { ScreenLoader } from "./components/ScreenLoader.js";
import * as THREE from "three";

function App() {
  const initialDataLoaded = useConfiguratorStore(state => state.initialDataLoaded);
  const character = useConfiguratorStore(state => state.character);
  if (!initialDataLoaded) {
    return <ScreenLoader />
  }

  if (!character?.name) {
    return <CharacterNameForm />
  }

  return (
    <>
      <Leva />
      <UI />
      <Canvas
        camera={{
          position: DEFAULT_CAMERA_POSITION as Vector3,
          fov: 45,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
        shadows
      >
        {/* <scene background={new THREE.Color("#000000")}> */}
        {/* <fog attach="fog" args={["black", 10, 40]} /> */}
        <group position-y={-1}>
          <Experience />
        </group>
        {/* <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1.2} intensity={1.2} />
        </EffectComposer> */}
        {/* </scene> */}
      </Canvas>
    </>
  );
}


export default App;
