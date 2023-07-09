import { useState, useEffect } from 'react'
import FreqDomainVisualiser from './Visualisers/FreqDomainVisualiser.jsx'
import TimeDomainVisualiser from './Visualisers/TimeDomainVisualiser.jsx'
import Experience from './Experience.jsx'

export default function AudioAnalyser() {
    const [freqDomainData, setFreqDomainData] = useState(new Uint8Array())
    const [timeDomainData, setTimeDomainData] = useState(new Uint8Array())

    useEffect(() => {
        let audioContext = new window.AudioContext()
        let analyser = audioContext.createAnalyser()
        let animationFrameId

        const handleSuccess = (stream) => {
            // Initialise audio context and analyser
            audioContext = new window.AudioContext()
            analyser = audioContext.createAnalyser()

            // NOTE: If changing fftSize, also change the frequency
            // data array length in the MainVisualiser component.
            // The length should be half of the fftSize
            analyser.fftSize = 256

            // Create a media stream source from the microphone stream
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            const bufferLength = analyser.frequencyBinCount

            // Render frame function for audio visualisation
            const renderFrame = () => {
                // Generate freq domain data
                const freqDomainDataArray = new Uint8Array(bufferLength)
                analyser.getByteFrequencyData(freqDomainDataArray)
                setFreqDomainData(freqDomainDataArray)

                // Generate time domain data
                const timeDomainDataArray = new Uint8Array(bufferLength)
                analyser.getByteTimeDomainData(timeDomainDataArray)
                setTimeDomainData(timeDomainDataArray)

                // Call the next frame
                animationFrameId = requestAnimationFrame(renderFrame)
            }

            // Begin rendering frames
            renderFrame()
        }

        // Error callback for getUserMedia
        const handleError = (error) => {
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
            <FreqDomainVisualiser data={freqDomainData} />
            <TimeDomainVisualiser data={timeDomainData} />
            <Experience freqData={freqDomainData} />
        </>
    )
}
