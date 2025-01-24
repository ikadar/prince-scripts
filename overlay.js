const overlay = document.getElementById('editor-overlay');
const resizeHandle = overlay.querySelector('.resize-handle');

let isDragging = false;
let isResizing = false;
let offsetX, offsetY;
let aspectRatio = overlay.offsetWidth / overlay.offsetHeight; // Calculate initial aspect ratio

// Dragging logic
overlay.addEventListener('mousedown', (e) => {
    if (e.target === resizeHandle) return; // Skip if resizing
    isDragging = true;
    offsetX = e.clientX - overlay.offsetLeft;
    offsetY = e.clientY - overlay.offsetTop;
    overlay.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        overlay.style.left = `${e.clientX - offsetX}px`;
        overlay.style.top = `${e.clientY - offsetY}px`;
    } else if (isResizing) {
        const newWidth = e.clientX - overlay.offsetLeft;
        const newHeight = e.clientY - overlay.offsetTop;

        if (e.shiftKey) {
            // Proportional resizing
            if (newWidth / newHeight > aspectRatio) {
                // Constrain by height
                overlay.style.width = `${newHeight * aspectRatio}px`;
                overlay.style.height = `${newHeight}px`;
            } else {
                // Constrain by width
                overlay.style.width = `${newWidth}px`;
                overlay.style.height = `${newWidth / aspectRatio}px`;
            }
        } else {
            // Free resizing
            overlay.style.width = `${Math.max(newWidth, 20)}px`; // Minimum width: 20px
            overlay.style.height = `${Math.max(newHeight, 20)}px`; // Minimum height: 20px
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    overlay.style.cursor = 'grab';
});

// Resizing logic
resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'se-resize'; // Change cursor during resize
    e.stopPropagation(); // Prevent triggering drag logic
    e.preventDefault(); // Prevent text selection or other default behaviors
});

function adjustOverlaySize() {
    const bodyRect = document.body.getBoundingClientRect();

    overlay.style.position = 'absolute';
    overlay.style.top = `${bodyRect.top}px`;
    overlay.style.left = `${bodyRect.left}px`;
    overlay.style.width = `${bodyRect.width}px`;
    overlay.style.height = `${bodyRect.height}px`;

    aspectRatio = overlay.offsetWidth / overlay.offsetHeight; // Update aspect ratio if size changes
}

// Adjust overlay size initially and on window resize
adjustOverlaySize();
window.addEventListener('resize', adjustOverlaySize);
