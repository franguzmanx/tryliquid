import { useEffect, useState, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const DEFAULT_FRAME_COUNT = 301
const DEFAULT_BASE_PATH = "https://filter-splash-7y0qjsc5k-dfguzmanx-gmailcoms-projects.vercel.app/frames_glass/frame_"
const DEFAULT_SCROLL_HEIGHT = 500

export default function ScrollVideo(props) {
    const frameCount = props.frameCount || DEFAULT_FRAME_COUNT
    const basePath = props.basePath || DEFAULT_BASE_PATH
    const scrollHeight = props.scrollHeight || DEFAULT_SCROLL_HEIGHT

    const [currentFrame, setCurrentFrame] = useState(1)
    const containerRef = useRef(null)

    // Safe frame number
    const safeFrame = Math.max(1, Math.min(currentFrame || 1, frameCount))
    const frameNum = String(safeFrame).padStart(4, "0")
    const imageSrc = `${basePath}${frameNum}.jpg`

    useEffect(() => {
        // Preload first 10 frames quickly
        for (let i = 1; i <= Math.min(10, frameCount); i++) {
            const img = new Image()
            img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`
        }
        // Preload rest in background
        setTimeout(() => {
            for (let i = 11; i <= frameCount; i++) {
                const img = new Image()
                img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`
            }
        }, 100)
    }, [frameCount, basePath])

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const containerHeight = rect.height - window.innerHeight

            // Start from frame 1 when component top is visible
            const scrolled = Math.max(0, -rect.top)
            const progress = containerHeight > 0 ? scrolled / containerHeight : 0
            const clampedProgress = Math.min(Math.max(progress, 0), 1)

            // Frame 1 at start, last frame at end
            const frame = Math.round(clampedProgress * (frameCount - 1)) + 1

            if (!isNaN(frame) && frame >= 1 && frame <= frameCount) {
                setCurrentFrame(frame)
            }
        }

        // Initial frame
        setCurrentFrame(1)

        window.addEventListener("scroll", handleScroll, true)

        // Delay first calculation to let Framer render
        setTimeout(handleScroll, 100)

        return () => {
            window.removeEventListener("scroll", handleScroll, true)
        }
    }, [frameCount])

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: `${scrollHeight}vh`,
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    overflow: "hidden",
                    backgroundColor: "#000",
                }}
            >
                <img
                    src={imageSrc}
                    alt=""
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
        </div>
    )
}

addPropertyControls(ScrollVideo, {
    frameCount: {
        type: ControlType.Number,
        title: "Frames",
        defaultValue: 301,
        min: 1,
        max: 1000,
    },
    basePath: {
        type: ControlType.String,
        title: "URL Base",
        defaultValue: "https://filter-splash-7y0qjsc5k-dfguzmanx-gmailcoms-projects.vercel.app/frames_glass/frame_",
    },
    scrollHeight: {
        type: ControlType.Number,
        title: "Scroll Height (vh)",
        defaultValue: 500,
        min: 100,
        max: 2000,
    },
})
