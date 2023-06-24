import * as THREE from 'three'
import { Canvas, extend, MaterialNode } from '@react-three/fiber'
import { CameraControls, shaderMaterial } from '@react-three/drei'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'
import { Perf } from 'r3f-perf'
import { useEffect, useRef } from 'react'
import { TextureImageData } from 'three/src/textures/types.js'

export interface IMainVisualiserProps {
    freqData: Uint8Array
    timeData: Uint8Array
}

export default function MainVisualiser(props: IMainVisualiserProps) {
    const textureRef = useRef<THREE.DataTexture | null>(null)

    useEffect(() => {
        if (textureRef.current != null) {
            const data = new Uint8ClampedArray(props.freqData)
            const height = 1
            const width = props.freqData.length

            const texData: TextureImageData = { data, height, width }

            textureRef.current.image = texData
            textureRef.current.needsUpdate = true
        } else {
            textureRef.current = new THREE.DataTexture(
                props.freqData,
                props.freqData.length,
                1,
                THREE.RedFormat
            )
        }
    }, [props])

    return (
        <Canvas camera={{ position: [0, 0.5, 1] }}>
            <Perf position="top-left" />
            <CameraControls />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1, 1, 32, 32]} />
                <visualiserMaterial
                    key={VisualiserMaterial.key}
                    side={THREE.DoubleSide}
                    transparent
                    // uTime={0}
                    // uColor={new THREE.Color('#000')}
                    // uAudioDataTexture={textureRef.current}
                    uniforms={{
                        uTime: { value: 0 },
                        uColor: { value: new THREE.Color('#000') },
                        uAudioDataTexture: { value: textureRef.current },
                    }}
                />
            </mesh>
        </Canvas>
    )
}

const VisualiserMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#000'),
        uAudioDataTexture: null,
    },
    vertexShader,
    fragmentShader
)

extend({ VisualiserMaterial })

declare module '@react-three/fiber' {
    interface ThreeElements {
        // TODO: Fix this error
        // I think I need to make a custom class extending THREE.ShaderMaterial for MaterialNode<> to play nice.
        visualiserMaterial: MaterialNode<THREE.ShaderMaterial, typeof VisualiserMaterial>
    }
}
