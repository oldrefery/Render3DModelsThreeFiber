import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { PrimitiveProps } from '@react-three/fiber/dist/declarations/src/three-types'; //0.2 480KB works

// Models can be downloaded from the collection of The Smithsonian
// https://3d.si.edu/explore

// import modelPath from './assets/models/bust.glb'; // 16.5MB works, 0.005
// import modelPath from './assets/models/bomb.glb'; // 4.7Mb works, scale 0.1
// import modelPath from './assets/models/mai.glb'; // 16.4Mb works, scale 0.05
import modelPath from './assets/models/gun.glb';
// import modelPath from './assets/models/wheel.glb'; //0.1 5.7MB works
// import modelPath from './assets/models/A7.glb'; //0.1 485MB - don't see but no errors
// import modelPath from './assets/models/French.glb'; //0.1 365MB - error OutOfMemory 25MB
// import modelPath from './assets/models/subm.glb'; //0.1 251MB - error OutOfMemory 25MB

function Model(props: PrimitiveProps) {
  const gltf = useGLTF(modelPath);
  return <primitive {...props} object={gltf.scene} scale={0.2} />;
}

export default function App() {
  return (
    <Canvas
      onCreated={state => {
        const _gl = state.gl.getContext();
        const pixelStorei = _gl.pixelStorei.bind(_gl);
        _gl.pixelStorei = function (...args) {
          const [parameter] = args;
          switch (parameter) {
            case _gl.UNPACK_FLIP_Y_WEBGL:
              return pixelStorei(...args);
          }
        };
      }}
    >
      <ambientLight />
      <Suspense>
        <Model />
      </Suspense>
    </Canvas>
  );
}
