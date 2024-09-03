import { Suspense, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { PrimitiveProps } from '@react-three/fiber/dist/declarations/src/three-types'; //0.2 480KB works

// Models can be downloaded from the collection of The Smithsonian
// https://3d.si.edu/explore

import bustPath from './assets/models/bust.glb'; // 16.5MB works, 0.005
import bombPath from './assets/models/bomb.glb'; // 4.7Mb works, scale 0.1
import maiPath from './assets/models/mai.glb'; // 16.4Mb works, scale 0.05
import gunPath from './assets/models/gun.glb'; // 480 KB, scale: 0.1
import wheelPath from './assets/models/wheel.glb'; //0.1 5.7MB works

// import modelPath from './assets/models/A7.glb'; //0.1 485MB - don't see but no errors
// import modelPath from './assets/models/French.glb'; //0.1 365MB - error OutOfMemory 25MB
// import modelPath from './assets/models/subm.glb'; //0.1 251MB - error OutOfMemory 25MB

type ModelProps = {
  modelPath: string;
  scale?: number;
} & Omit<PrimitiveProps, 'object'>;
type ModelInfo = {
  path: string;
  scale: number;
  weight: string;
  name: string;
};

const modelPaths: Array<ModelInfo> = [
  { path: bustPath, scale: 0.005, weight: '16.5 MB', name: 'Bust' },
  { path: bombPath, scale: 0.1, weight: '4.7 MB', name: 'Bomb' },
  { path: maiPath, scale: 0.05, weight: '16.4 MB', name: 'Mai' },
  { path: gunPath, scale: 0.1, weight: '480 KB', name: 'Gun' },
  { path: wheelPath, scale: 1.6, weight: '5.7 MB', name: 'Wheel' },
];

function Model({ modelPath, scale = 1, ...props }: ModelProps) {
  const gltf = useGLTF(modelPath);
  return <primitive {...props} object={gltf.scene} scale={scale} />;
}

export default function App() {
  const [model, setModel] = useState(modelPaths[4]);

  return (
    <View style={{ flex: 1 }}>
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
          <Model modelPath={model.path} scale={model.scale} />
        </Suspense>
      </Canvas>
      <FlatList
        data={modelPaths}
        style={{
          maxHeight: 90,
          backgroundColor: 'lightgreen',
        }}
        contentContainerStyle={{
          alignContent: 'center',
          justifyContent: 'space-around',
          padding: 20,
          width: '100%',
          gap: 30,
          backgroundColor: 'blue',
        }}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 10,
            }}
            onPress={() => setModel(item)}
          >
            <Text>{item.name}</Text>
            <Text>{item.weight}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
