# Scroll Video Animation - Complete Guide

This guide documents the complete process for creating Apple-style scroll-controlled video animations. It includes versions for vanilla web and Framer components.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Frame Extraction](#frame-extraction)
3. [Vanilla Web Version](#vanilla-web-version)
4. [WebGL Version with Effects](#webgl-version-with-effects)
5. [Framer Component](#framer-component)
6. [Deployment to Vercel](#deployment-to-vercel)
7. [Leverage Scroll Component](#leverage-scroll-component)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Install FFmpeg

FFmpeg is required to extract frames from video.

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows (with Chocolatey)
choco install ffmpeg
```

### Project Structure

```
project/
├── index.html
├── styles.css
├── script.js
├── frames/           # Frames extracted from video
│   ├── frame_0001.jpg
│   ├── frame_0002.jpg
│   └── ...
├── Video.mp4         # Original video
└── README.md
```

---

## Frame Extraction

### Basic command

```bash
# Create folder for frames
mkdir -p frames

# Extract frames at 30fps with high quality
ffmpeg -i Video.mp4 -vf "fps=30" -q:v 2 frames/frame_%04d.jpg
```

### Parameters explained

| Parameter | Description |
|-----------|-------------|
| `-i Video.mp4` | Input video |
| `-vf "fps=30"` | Extract 30 frames per second |
| `-q:v 2` | Quality (1-31, lower = better) |
| `frame_%04d.jpg` | Name with 4 digits (0001, 0002...) |

### Count extracted frames

```bash
ls frames/ | wc -l
```

---

## Vanilla Web Version

### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scroll Video Animation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="scroll-container">
        <div class="sticky-wrapper">
            <canvas id="video-canvas"></canvas>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### styles.css

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html, body {
    overflow-x: hidden;
}

/* Height controls animation speed */
/* Higher = slower, Lower = faster */
.scroll-container {
    height: 500vh;
    position: relative;
}

/* Keeps the canvas fixed while scrolling */
.sticky-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

#video-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Hide scrollbar */
body::-webkit-scrollbar {
    display: none;
}

body {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
```

### script.js

```javascript
// Configuration - MODIFY ACCORDING TO YOUR VIDEO
const CONFIG = {
    frameCount: 176,              // Total extracted frames
    framePath: 'frames/frame_',   // Path to frames
    frameExtension: '.jpg',       // Frame extension
    startFrame: 1                 // First frame number
};

// State
let frames = [];
let canvas, ctx;
let isLoaded = false;

// Initialize
function init() {
    canvas = document.getElementById('video-canvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    preloadFrames();
}

// Adjust canvas to viewport
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (isLoaded) {
        const progress = getScrollProgress();
        drawFrame(progress);
    }
}

// Preload all frames into memory
function preloadFrames() {
    let loadedCount = 0;

    // Loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.textContent = 'Loading frames...';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: system-ui;
        font-size: 1.2rem;
        color: white;
        background: rgba(0,0,0,0.7);
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 100;
    `;
    document.body.appendChild(loadingDiv);

    for (let i = CONFIG.startFrame; i <= CONFIG.frameCount; i++) {
        const img = new Image();
        const frameNum = String(i).padStart(4, '0');
        img.src = `${CONFIG.framePath}${frameNum}${CONFIG.frameExtension}`;

        img.onload = () => {
            loadedCount++;
            loadingDiv.textContent = `Loading frames... ${Math.round(loadedCount / CONFIG.frameCount * 100)}%`;

            if (loadedCount === CONFIG.frameCount) {
                isLoaded = true;
                loadingDiv.remove();
                drawFrame(0);
                window.addEventListener('scroll', onScroll);
                console.log('All frames loaded!');
            }
        };

        img.onerror = () => {
            console.error(`Failed to load frame: ${img.src}`);
        };

        frames.push(img);
    }
}

// Calculate scroll progress (0 to 1)
function getScrollProgress() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
}

// Handle scroll event
function onScroll() {
    if (!isLoaded) return;
    const progress = getScrollProgress();
    drawFrame(progress);
}

// Draw the correct frame based on progress
function drawFrame(progress) {
    const frameIndex = Math.min(
        Math.floor(progress * CONFIG.frameCount),
        CONFIG.frameCount - 1
    );

    const img = frames[frameIndex];

    if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scale to cover (like background-size: cover)
        const scale = Math.max(
            canvas.width / img.width,
            canvas.height / img.height
        );

        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(img, x, y, width, height);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

---

## WebGL Version with Effects

This version uses WebGL to render frames and can include effects like ripple/distortion.

### script.js (WebGL)

```javascript
// Configuration
const CONFIG = {
    frameCount: 301,
    framePath: 'frames_glass/frame_',
    frameExtension: '.jpg',
    startFrame: 1
};

// State
let gl, program;
let frames = [];
let textures = [];
let isLoaded = false;
let currentFrame = 0;
let mousePos = { x: 0.5, y: 0.5 };
let targetMousePos = { x: 0.5, y: 0.5 };
let time = 0;

// Shaders
const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTexCoord = aTexCoord;
}`;

// Shader without effects (video only)
const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;

void main() {
    vec2 uv = vTexCoord;
    vec4 color = texture(uTexture, uv);
    fragColor = color;
}`;

// Shader with ripple effect
const fragmentShaderWithRipple = `#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMousePos;
uniform vec2 uResolution;

const float PI = 3.1415926;

void main() {
    vec2 uv = vTexCoord;
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);

    vec2 pos = uMousePos;
    vec2 adjustedPos = (pos - 0.5) * aspectRatio;
    vec2 adjustedUv = (uv - 0.5) * aspectRatio;

    float dist = length(adjustedUv - adjustedPos);
    vec2 direction = normalize(adjustedUv - adjustedPos);

    if (length(direction) < 0.0001) {
        direction = vec2(0.0, 1.0);
    }

    // Ripple parameters
    float frequency = 0.19 * 50.0;
    float strength = 0.08 * 0.2;
    float easeDistValue = max(0.0, 1.0 - dist);
    float waveStrength = strength * easeDistValue;
    float wave = sin(dist * frequency - uTime * 0.05) * waveStrength;

    uv += direction * wave;

    vec4 color = texture(uTexture, uv);
    fragColor = color;
}`;

// Initialize WebGL
function initWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL2 not supported');
        return false;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return false;
    }

    // Fullscreen geometry
    const positions = new Float32Array([
        -1, -1,  1, -1,  -1, 1,
        -1, 1,   1, -1,   1, 1
    ]);

    const texCoords = new Float32Array([
        0, 1,  1, 1,  0, 0,
        0, 0,  1, 1,  1, 0
    ]);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texLoc = gl.getAttribLocation(program, 'aTexCoord');
    gl.enableVertexAttribArray(texLoc);
    gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    return true;
}

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function createTexture(image) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
}

// ... remaining functions same as vanilla version
```

---

## Framer Component

### ScrollVideo.tsx

```tsx
import { useEffect, useState, useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

const DEFAULT_FRAME_COUNT = 301
const DEFAULT_BASE_PATH = "https://your-domain.com/frames/frame_"
const DEFAULT_SCROLL_HEIGHT = 500

export default function ScrollVideo(props) {
    const frameCount = props.frameCount || DEFAULT_FRAME_COUNT
    const basePath = props.basePath || DEFAULT_BASE_PATH
    const scrollHeight = props.scrollHeight || DEFAULT_SCROLL_HEIGHT

    const [currentFrame, setCurrentFrame] = useState(1)
    const containerRef = useRef(null)

    const safeFrame = Math.max(1, Math.min(currentFrame || 1, frameCount))
    const frameNum = String(safeFrame).padStart(4, "0")
    const imageSrc = `${basePath}${frameNum}.jpg`

    useEffect(() => {
        // Preload frames
        for (let i = 1; i <= Math.min(10, frameCount); i++) {
            const img = new Image()
            img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`
        }
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
            const scrolled = Math.max(0, -rect.top)
            const progress = containerHeight > 0 ? scrolled / containerHeight : 0
            const clampedProgress = Math.min(Math.max(progress, 0), 1)
            const frame = Math.round(clampedProgress * (frameCount - 1)) + 1

            if (!isNaN(frame) && frame >= 1 && frame <= frameCount) {
                setCurrentFrame(frame)
            }
        }

        setCurrentFrame(1)
        window.addEventListener("scroll", handleScroll, true)
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
        title: "Base URL",
        defaultValue: "https://your-domain.com/frames/frame_",
    },
    scrollHeight: {
        type: ControlType.Number,
        title: "Scroll Height (vh)",
        defaultValue: 500,
        min: 100,
        max: 2000,
    },
})
```

---

## Deployment to Vercel

### Quick method (CLI)

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Deploy
cd your-project
vercel --prod
```

### Important configuration

1. **Deployment Protection**: Go to Settings → Deployment Protection → Disable for production (if you want public access)

2. **Domain**: The project will be at `https://your-project.vercel.app`

3. **Frames URL**: Your frames will be at:
   ```
   https://your-project.vercel.app/frames/frame_0001.jpg
   ```

---

## Leverage Scroll Component

This component displays numbers that change with scroll (e.g., $100 → $5,000).

### leverage.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leverage Scroll</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Inter, system-ui, sans-serif; }

        .scroll-container {
            height: 300vh;
            position: relative;
        }

        .sticky-content {
            position: sticky;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .title-line {
            font-size: 64px;
            font-weight: 600;
            letter-spacing: -0.07em;
            text-align: center;
        }

        .faded { opacity: 0.5; }
    </style>
</head>
<body>
    <div class="scroll-container" id="container">
        <div class="sticky-content">
            <div class="title-line">
                <span class="faded">Your </span>
                <span>$100 </span>
                <span class="faded">becomes </span>
                <span id="amount">$100</span>
            </div>
        </div>
    </div>

    <script>
        const CONFIG = {
            baseAmount: 100,
            maxAmount: 5000,
            currencySymbol: '$'
        };

        function formatCurrency(n) {
            return CONFIG.currencySymbol + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function getScrollProgress() {
            const container = document.getElementById('container');
            const rect = container.getBoundingClientRect();
            const containerHeight = rect.height - window.innerHeight;
            const scrolled = Math.max(0, -rect.top);
            return Math.min(Math.max(scrolled / containerHeight, 0), 1);
        }

        function updateAmount() {
            const progress = getScrollProgress();
            const amount = CONFIG.baseAmount + progress * (CONFIG.maxAmount - CONFIG.baseAmount);
            document.getElementById('amount').textContent = formatCurrency(amount);
        }

        window.addEventListener('scroll', updateAmount);
        updateAmount();
    </script>
</body>
</html>
```

---

## Troubleshooting

### Video doesn't start from the beginning

- Make sure the component is at the top of the page
- There should be no content above the component
- Verify that `startFrame` is 1

### Frames don't load

- Verify the frame paths
- Make sure CORS is enabled if using an external CDN
- Check the browser console for errors

### Scroll doesn't work in Framer

- Scroll **only works in Preview**, not in the editor
- Use `position: sticky` instead of `position: fixed` for Framer

### NaN in frame number

- Make sure props have default values
- Use fallbacks: `props.frameCount || 301`

### Slow performance

- Reduce the number of frames (use fps=24 instead of 30)
- Compress frames with lower quality
- Use WebP instead of JPG if the browser supports it

---

## Example URLs

- **Video Scroll Demo**: https://filter-splash-xxx.vercel.app/
- **Leverage Demo**: https://filter-splash-xxx.vercel.app/leverage.html
- **Frames**: https://filter-splash-xxx.vercel.app/frames_glass/frame_0001.jpg

---

## Credits

Created with Claude Code. For more information or contributions, open an issue in the repository.
