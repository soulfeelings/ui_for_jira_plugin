import { Canvas, Vector3 } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager";
import { Experience } from "./components/Experience.jsx";
import { UI } from "./components/UI.jsx";
import { useConfiguratorStore } from "./store";
import { CharacterNameForm } from "./components/CharacterNameForm.jsx";
import { ScreenLoader } from "./components/ScreenLoader.jsx";
import { AuthForm } from "./components/AuthForm";
import { useEffect } from "react";
import * as THREE from "three";

function App() {
  const initialDataLoaded = useConfiguratorStore(state => state.initialDataLoaded);
  const character = useConfiguratorStore(state => state.character);
  const user = useConfiguratorStore(state => state.user);
  const fetchInitialData = useConfiguratorStore(state => state.fetchInitialData);
  const fetchUser = useConfiguratorStore(state => state.fetchUser);

  useEffect(() => {
    // Проверяем, есть ли сохраненный токен в localStorage
    const savedToken = localStorage.getItem('pocketbase_auth');
    if (savedToken) {
      try {
        const { token, record } = JSON.parse(savedToken);
        if (token && record) {
          // Восстанавливаем состояние аутентификации
          useConfiguratorStore.getState().pb.authStore.save(token, record);
          fetchInitialData();
        }
      } catch (e) {
        localStorage.removeItem('pocketbase_auth');
      }
    }
  }, []);

  if (!user) {
    return <AuthForm />;
  }

  if (!initialDataLoaded) {
    return <ScreenLoader />;
  }

  if (!character?.name) {
    return <CharacterNameForm />;
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
        <group position-y={-1}>
          <Experience />
        </group>
      </Canvas>
    </>
  );
}

export default App;