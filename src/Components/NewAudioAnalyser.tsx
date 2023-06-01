/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react'
import FreqDomainVisualiser from './FreqDomainVisualiser'
import TimeDomainVisualiser from './TimeDomainVisualiser'

export default function NewAudioAnalyser() {
    const [freqDomainData, setFreqDomainData] = useState<Uint8Array>(new Uint8Array())
    const [timeDomainData, setTimeDomainData] = useState<Uint8Array>(new Uint8Array())

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

            const bufferLength = analyser.frequencyBinCount

            // Render frame function for audio visualization
            const renderFrame = () => {
                // Generate frequency domain data
                const freqDomainDataArray = new Uint8Array(bufferLength)
                analyser!.getByteFrequencyData(freqDomainDataArray)
                setFreqDomainData(freqDomainDataArray)

                // Generate time domain data
                const timeDomainDataArray = new Uint8Array(bufferLength)
                analyser!.getByteTimeDomainData(timeDomainDataArray)
                setTimeDomainData(timeDomainDataArray)

                // Call the next frame
                animationFrameId = requestAnimationFrame(renderFrame)
            }

            renderFrame()
        }

        // Error callback for getUserMedia
        const handleError = (error: DOMException) => {
            console.error('Error accessing microphone:', error)
        }

        // Request access to microphone stream
        navigator.mediaDevices.getUserMedia({ audio: true }).then(handleSuccess).catch(handleError)

        return () => {
            cancelAnimationFrame(animationFrameId)
            // Close the audio context
            if (audioContext) {
                audioContext.close()
            }
        }
    }, [])

    return (
        <>
            <FreqDomainVisualiser audio={freqDomainData} />
            <TimeDomainVisualiser audio={timeDomainData} />
        </>
    )
}
