import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useEffect } from 'react'

export default function FreqDomainVisualiser(props) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current != null) {
            const canvas = canvasRef.current
            const canvasContext = canvas.getContext('2d')

            const CANVAS_WIDTH = 300
            const CANVAS_HEIGHT = CANVAS_WIDTH / 2

            const audioData = props.data
            const bufferLength = audioData.length

            // Clear the canvas
            canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

            // Set up the audio visualisation bars
            const barWidth = Math.floor(CANVAS_WIDTH / bufferLength)
            let barHeight
            let posX = 0

            // Render audio visualisation bars
            for (let i = 0; i < bufferLength; i++) {
                barHeight = audioData[i]

                canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
                canvasContext.fillRect(posX, CANVAS_HEIGHT - barHeight / 2, barWidth, barHeight / 2)
                posX += barWidth + 1
            }
        }
    }, [props])

    return <canvas ref={canvasRef} className="fixed bottom-0 left-0 w-[300px]" />
}

FreqDomainVisualiser.propTypes = {
    data: PropTypes.object.isRequired,
}
