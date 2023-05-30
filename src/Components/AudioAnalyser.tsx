/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef } from 'react'

const AudioAnalyser: React.FC = () => {
    const freqCanvasRef = useRef<HTMLCanvasElement>(null)
    const timeCanvasRef = useRef<HTMLCanvasElement>(null)

    const CANVAS_WIDTH = 400
    const CANVAS_HEIGHT = CANVAS_WIDTH / 2
    // const freqCanvasClassName = `fixed bottom-0 left-0 w-[${CANVAS_WIDTH}px]`
    // const timeCanvasClassName = `fixed bottom-0 left-[${CANVAS_WIDTH}px] w-[${CANVAS_WIDTH}px]`

    // useEffect hook to retrieve audio and create the visualiser
    useEffect(() => {
        let audioContext: AudioContext | undefined
        let analyser: AnalyserNode | undefined
        let animationFrameId: number

        // Success callback for getUserMedia
        const handleSuccess = (stream: MediaStream) => {
            // Initialise audio context and analyser
            audioContext = new window.AudioContext()
            analyser = audioContext.createAnalyser()
            analyser.fftSize = 128

            // Create a media stream source from the microphone stream
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            // Get the canvas and its 2D rendering context
            const freqCanvas = freqCanvasRef.current!
            const freqCanvasContext = freqCanvas.getContext('2d')!
            const timeCanvas = timeCanvasRef.current!
            const timeCanvasContext = timeCanvas.getContext('2d')!

            // Render frame function for audio visualization
            const renderFrame = () => {
                // Render both visualisers
                drawFrequencyDomain()
                drawTimeDomain()

                // Call the next frame
                animationFrameId = requestAnimationFrame(renderFrame)
            }

            const drawFrequencyDomain = () => {
                // Get frequency data from the analyser
                const bufferLength = analyser!.frequencyBinCount
                const dataArray = new Uint8Array(bufferLength)
                analyser!.getByteFrequencyData(dataArray)

                // Clear the canvas
                freqCanvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

                // Set up audio visualisation bars
                const barWidth = Math.floor(CANVAS_WIDTH / bufferLength)
                let barHeight: number
                let posX = 0

                // Render audio visualization bars
                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i]

                    freqCanvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
                    freqCanvasContext.fillRect(
                        posX,
                        CANVAS_HEIGHT - barHeight / 2,
                        barWidth,
                        barHeight / 2
                    )
                    posX += barWidth + 1
                }
            }

            const drawTimeDomain = () => {
                if (analyser && source) {
                    // Get frequency data from the analyser
                    const bufferLength = analyser.frequencyBinCount
                    const dataArray = new Uint8Array(bufferLength)
                    analyser.getByteTimeDomainData(dataArray)

                    timeCanvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

                    // timeCanvasContext.fillStyle = `rgb(255, 50, 50)`
                    timeCanvasContext.lineWidth = 2
                    timeCanvasContext.strokeStyle = 'rgb(255, 50, 50)'

                    const sliceWidth = (CANVAS_WIDTH * 1.0) / bufferLength

                    let posX = 0

                    timeCanvasContext.beginPath()
                    for (let i = 0; i < bufferLength; i++) {
                        const value = dataArray[i] / 128
                        const posY = (value * CANVAS_HEIGHT) / 2

                        if (i === 0) {
                            timeCanvasContext.moveTo(posX, posY)
                        } else {
                            timeCanvasContext.lineTo(posX, posY)
                        }
                        posX += sliceWidth
                    }

                    timeCanvasContext.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)
                    timeCanvasContext.stroke()
                }
            }

            // Start rendering frames
            renderFrame()
        }

        // Error callback for getUserMedia
        const handleError = (error: DOMException) => {
            console.error('Error accessing microphone:', error)
        }

        // Request access to microphone stream
        navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess).catch(handleError)

        return () => {
            // Cancel animation frame and close the audio context
            cancelAnimationFrame(animationFrameId)
            if (audioContext) {
                audioContext.close()
            }
        }
    }, [CANVAS_HEIGHT])

    return (
        <>
            <canvas ref={freqCanvasRef} className="fixed bottom-0 left-0 w-[300px]" />
            <canvas ref={timeCanvasRef} className="fixed bottom-0 left-[300px] w-[300px]" />
        </>
    )
}

export default AudioAnalyser
