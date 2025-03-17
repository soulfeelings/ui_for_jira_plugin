import { animated, useSpring } from '@react-spring/three';

export const LoadingAvatar = ({ loading }) => {
  const { scaleY, opacity } = useSpring({
    scaleY: loading ? 1 : 0,
    opacity: loading ? 1 : 0,
    config: { tension: 280, friction: 60 },
  });
  return (
    <animated.group scale-y={scaleY} scale-x={1} scale-z={1} position-y={-0.1} opacity={opacity}>
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 4]} />
        <meshStandardMaterial
          color={'orange'}
          emissive={'orange'}
          emissiveIntensity={5}
          opacity={0.1}
          transparent
        />
      </mesh>
      <mesh position-y={2}>
        <cylinderGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial
          color={'orange'}
          emissive={'orange'}
          emissiveIntensity={4}
          opacity={0.8}
          transparent
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial
          color={'orange'}
          emissive={'orange'}
          emissiveIntensity={4}
          opacity={0.8}
          transparent
        />
      </mesh>
    </animated.group>
  );
};
