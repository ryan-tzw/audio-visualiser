/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useEffect } from 'react'

export interface ITimeDomainVisualiserProps {
    audio: Uint8Array
}

export default function TimeDomainVisualiser(props: ITimeDomainVisualiserProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const canvasContext = canvas.getContext('2d')!

        const CANVAS_WIDTH = 300
        const CANVAS_HEIGHT = CANVAS_WIDTH / 2

        const audioData = props.audio
        const bufferLength = audioData.length

        // Clear the canvas
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        canvasContext.lineWidth = 2
        canvasContext.strokeStyle = 'rgb(255, 50, 50)'

        // x-axis interval between each point on the line
        const sliceWidth = CANVAS_WIDTH / bufferLength

        canvasContext.beginPath()

        let posX = 0
        for (let i = 0; i < bufferLength; i++) {
            // Calculate height of each point where the line should be drawn
            const value = audioData[i] / (bufferLength * 2)
            const posY = (value * CANVAS_HEIGHT) / 2

            // Draw the line
            if (i === 0) {
                canvasContext.moveTo(posX, posY)
            } else {
                canvasContext.lineTo(posX, posY)
            }
            posX += sliceWidth
        }

        canvasContext.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)
        canvasContext.stroke()
    }, [props.audio])

    return <canvas ref={canvasRef} className="fixed bottom-0 left-0 w-[300px]" />
}
