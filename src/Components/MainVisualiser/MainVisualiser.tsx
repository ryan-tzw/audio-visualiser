import { shaderMaterial } from '@react-three/drei'
import { Canvas, extend } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import fragmentShader from './shaders/frag.glsl'
import vertexShader from './shaders/vert.glsl'
import * as THREE from 'three'

export interface IMainVisualiserProps {
    freqData: Uint8Array
    timeData: Uint8Array
}

export default function MainVisualiser(props: IMainVisualiserProps) {
    return (
        <Canvas>
            <Perf position="top-left" />
            <mesh>
                <sphereGeometry />
                <visualiserMaterial color="hotpink" />
            </mesh>
        </Canvas>
    )
}

const VisualiserMaterial = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color('#ffffff'),
    },
    vertexShader,
    fragmentShader
)
extend({ VisualiserMaterial })
