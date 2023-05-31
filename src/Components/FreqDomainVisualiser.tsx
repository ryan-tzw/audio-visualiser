/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useRef, useEffect } from 'react'

export interface IFreqDomainVisualiserProps {
    audio: Uint8Array
}

export default function FreqDomainVisualiser(props: IFreqDomainVisualiserProps) {
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

        // Set up audio visualisation bars
        const barWidth = Math.floor(CANVAS_WIDTH / bufferLength)
        let barHeight: number
        let posX = 0

        // Render audio visualization bars
        for (let i = 0; i < bufferLength; i++) {
            barHeight = audioData[i]

            canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
            canvasContext.fillRect(posX, CANVAS_HEIGHT - barHeight / 2, barWidth, barHeight / 2)
            posX += barWidth + 1
        }
    }, [props.audio])

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-[300px]" />
}
