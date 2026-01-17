// ============================================
// CONFIGURACIÓN
// ============================================
const CONFIG = {
    // Video frames
    frameCount: 301,
    framePath: 'frames_glass/frame_',
    frameExtension: '.jpg',
    startFrame: 1,

    // Leverage
    baseAmount: 100,
    maxAmount: 5000,
    currencySymbol: '$'
};

// ============================================
// ESTADO
// ============================================
let frames = [];
let canvas, ctx;
let isLoaded = false;

// ============================================
// UTILIDADES
// ============================================
function formatCurrency(n) {
    const rounded = Math.round(n);
    return CONFIG.currencySymbol + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getScrollProgress() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
}

// ============================================
// VIDEO SCROLL
// ============================================
function initVideo() {
    canvas = document.getElementById('video-canvas');
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    preloadFrames();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (isLoaded) {
        const progress = getScrollProgress();
        drawFrame(progress);
    }
}

function preloadFrames() {
    let loadedCount = 0;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.textContent = 'Loading frames...';
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

function drawFrame(progress) {
    const frameIndex = Math.min(
        Math.floor(progress * CONFIG.frameCount),
        CONFIG.frameCount - 1
    );

    const img = frames[frameIndex];

    if (img && img.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// ============================================
// LEVERAGE
// ============================================
function updateLeverage(progress) {
    const amount = CONFIG.baseAmount + progress * (CONFIG.maxAmount - CONFIG.baseAmount);
    const amountElement = document.getElementById('amount');
    if (amountElement) {
        amountElement.textContent = formatCurrency(amount);
    }
}

// ============================================
// SCROLL HANDLER
// ============================================
function onScroll() {
    const progress = getScrollProgress();

    // Actualizar video
    if (isLoaded) {
        drawFrame(progress);
    }

    // Actualizar leverage
    updateLeverage(progress);
}

// ============================================
// INICIALIZAR
// ============================================
function init() {
    initVideo();
    updateLeverage(0);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
