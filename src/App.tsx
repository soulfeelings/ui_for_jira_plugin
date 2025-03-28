import { Canvas, Vector3 } from "@react-three/fiber";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager";
import { Experience } from "./components/Experience.jsx";
import { UI } from "./components/UI.jsx";
import { useConfiguratorStore } from "./store";
import { CharacterNameForm } from "./components/CharacterNameForm.jsx";
import { ScreenLoader } from "./components/ScreenLoader.jsx";
import { AuthForm } from "./components/AuthForm";

function App() {
  const initialDataLoadedStatus = useConfiguratorStore(
    (state) => state.initialDataLoadedStatus
  );
  const character = useConfiguratorStore((state) => state.character);

  if (initialDataLoadedStatus === "need_auth") {
    return <AuthForm />;
  }

  if (initialDataLoadedStatus === "loading") {
    return <ScreenLoader />;
  }

  // TODO: change to router
  // character?.name is only to rerender the component when the character name is set
  if (!character?.name || initialDataLoadedStatus === "need_character") {
    return <CharacterNameForm />;
  }

  return (
    <>
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
        <group position-y={-1}>
          <Experience />
        </group>
      </Canvas>
    </>
  );
}

export default App;
