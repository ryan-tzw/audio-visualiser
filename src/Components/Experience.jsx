import { Canvas } from '@react-three/fiber'
import MainVisualiser from './Visualisers/MainVisualiser/MainVisualiser.jsx'
import PropTypes from 'prop-types'

export default function Experience(props) {
    return (
        <Canvas camera={{ position: [0, 0.5, 1] }}>
            <MainVisualiser freqData={props.freqData} />
        </Canvas>
    )
}

Experience.propTypes = {
    freqData: PropTypes.object.isRequired,
}
