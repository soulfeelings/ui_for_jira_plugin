import { Canvas, Vector3 } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager.jsx";
import { Experience } from "./components/Experience.jsx";
import { UI } from "./components/UI.jsx";
import { useConfiguratorStore } from "./store.js";
import { CharacterNameForm } from "./components/CharacterNameForm.jsx";
import { ScreenLoader } from "./components/ScreenLoader.jsx";

function App() {
  const initialDataLoaded = useConfiguratorStore(state => state.initialDataLoaded);
  const character = useConfiguratorStore(state => state.character);
  // if (!initialDataLoaded) {
  //   return <ScreenLoader />
  // }

  if (!character.name) {
    return <CharacterNameForm />
  }

  return (
    <>
      <Leva hidden />
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
        <color attach="background" args={["#130f30"]} />
        <fog attach="fog" args={["#130f30", 10, 40]} />
        <group position-y={-1}>
          <Experience />
        </group>
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1.2} intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
