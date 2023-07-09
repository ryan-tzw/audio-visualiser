/* eslint-disable react/no-unknown-property */
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { CameraControls, shaderMaterial } from '@react-three/drei'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'
import { extend } from '@react-three/fiber'
import PropTypes from 'prop-types'

export default function MainVisualiser({ freqData }) {
    const textureRef = useRef(null)
    // console.log(freqData)

    useEffect(() => {
        if (textureRef.current != null) {
            const data = new Uint8ClampedArray(freqData)
            const height = 1
            const width = freqData.length

            const texData = { data, height, width }

            textureRef.current.image = texData
            textureRef.current.needsUpdate = true
        } else {
            textureRef.current = new THREE.DataTexture(
                freqData,
                freqData.length,
                1,
                THREE.RedFormat
            )
        }
    }, [freqData])

    return (
        <>
            <Perf position="top-left" />
            <CameraControls />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[1, 1, 256, 256]} />
                <visualiserMaterial
                    key={VisualiserMaterial.key}
                    side={THREE.DoubleSide}
                    transparent
                    uTime={0}
                    uColor={new THREE.Color('#000')}
                    uAudioDataTexture={textureRef.current}
                    uAudioDataArr={freqData}
                    uAudioDataArrLastIndex={freqData.length - 1}
                />
            </mesh>
        </>
    )
}

MainVisualiser.propTypes = {
    freqData: PropTypes.object.isRequired,
}

/**
 * Custom shader material
 */

const VisualiserMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color('#000'),
        uAudioDataTexture: null,
        uAudioDataArr: null,
        uAudioDataArrLastIndex: 0,
    },
    vertexShader,
    fragmentShader
)

extend({ VisualiserMaterial })
