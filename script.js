// Updated script.js using array indices instead of IDs
// imageData should be defined in image-config.js and included before this script

const displayDuration = 5000; // How long each image is displayed (ms)
const fadeInTimeLow = 2500;   // How long low-res fade-in takes (ms)
const fadeInTimeHigh = 2000;  // How long high-res fade-in takes (ms)
const fadeOutTime = 1200;     // How long fade-out takes (ms)
const overlapTime = 500;      // How much the transitions overlap (ms)

// State
let currentIndex = 0;
let preloadedImages = new Set();
let cycleTimeout = null;

// DOM elements
const imageContainer = document.querySelector('.image-container');
const captionElement = document.getElementById('current-caption');

// Preload all images
function preloadImages() {
    imageData.forEach((image, index) => {
        const highResImg = new Image();
        highResImg.src = image.highRes;
        highResImg.onload = () => {
            preloadedImages.add(index); // Store index instead of ID
            console.log(`Preloaded image ${index}`);
        };
        
        const lowResImg = new Image();
        lowResImg.src = image.lowRes;
    });
}

// Create elements for all images
function createImageElements() {
    // Clear any existing images
    imageContainer.innerHTML = '';
    
    imageData.forEach((image, index) => {
        // Create low-res version
        const lowResElement = document.createElement('div');
        lowResElement.className = 'artwork lowres';
        lowResElement.id = `artwork-${index}-low`; // Use array index instead of ID
        lowResElement.style.opacity = '0'; // Ensure it starts invisible
        
        const lowResImg = document.createElement('img');
        lowResImg.src = image.lowRes;
        lowResImg.alt = image.title;
        lowResElement.appendChild(lowResImg);
        
        // Create high-res version
        const highResElement = document.createElement('div');
        highResElement.className = 'artwork';
        highResElement.id = `artwork-${index}-high`; // Use array index instead of ID
        highResElement.style.opacity = '0'; // Ensure it starts invisible
        
        const highResImg = document.createElement('img');
        highResImg.src = image.highRes;
        highResImg.alt = image.title;
        highResElement.appendChild(highResImg);
        
        // Add to container
        imageContainer.appendChild(lowResElement);
        imageContainer.appendChild(highResElement);
    });
    
    // Delay first image show slightly to ensure opacity is recognized
    setTimeout(() => {
        showImage(0);
    }, 50);
}

// Show image at specified index
function showImage(index) {
    const image = imageData[index];
    
    // Get elements
    const lowResElement = document.getElementById(`artwork-${index}-low`);
    const highResElement = document.getElementById(`artwork-${index}-high`);
    
    if (!lowResElement || !highResElement) return;
    
    // Set transition times in CSS
    lowResElement.style.transitionDuration = `${fadeInTimeLow}ms`;
    lowResElement.style.transitionProperty = 'opacity';
    lowResElement.style.transitionTimingFunction = 'ease-in-out';
    
    highResElement.style.transitionDuration = `${fadeInTimeHigh}ms`;
    highResElement.style.transitionProperty = 'opacity';
    highResElement.style.transitionTimingFunction = 'ease-in-out';
    
    // Show caption
    if (captionElement) {
        captionElement.textContent = image.title;
        captionElement.style.transitionDuration = `${fadeInTimeLow}ms`;
        captionElement.style.opacity = '0';
        
        // Force reflow before starting transition
        captionElement.offsetHeight;
        
        captionElement.style.opacity = '1';
    }
    
    // Force reflow to ensure transitions work
    lowResElement.offsetHeight;
    
    // Start low-res fade-in
    lowResElement.style.opacity = '1';
    
    // Start high-res fade in earlier (25% of low-res fade time)
    const highResDelay = fadeInTimeLow * 0.25;
    
    // Check when high-res is ready
    function checkHighResLoaded() {
        if (preloadedImages.has(index)) { // Check index instead of ID
            // Start high-res fade after short delay
            setTimeout(() => {
                // Force reflow for high-res
                highResElement.offsetHeight;
                
                // Show high-res with faster transition
                highResElement.style.opacity = '1';
                
                // Fade out low-res after high-res is 60% faded in
                setTimeout(() => {
                    lowResElement.style.transitionDuration = `${fadeOutTime}ms`;
                    lowResElement.style.opacity = '0';
                }, fadeInTimeHigh * 0.6);
            }, highResDelay);
            
            // Schedule next image
            cycleTimeout = setTimeout(() => cycleToNextImage(), displayDuration);
        } else {
            // Check again in 100ms
            setTimeout(checkHighResLoaded, 100);
        }
    }
    
    checkHighResLoaded();
}

// Transition to next image with overlap
function cycleToNextImage() {
    // Clear any existing timeout
    if (cycleTimeout) {
        clearTimeout(cycleTimeout);
        cycleTimeout = null;
    }
    
    // Get current image elements
    const currentHighRes = document.getElementById(`artwork-${currentIndex}-high`);
    
    // Calculate next index
    const nextIndex = (currentIndex + 1) % imageData.length;
    
    // Hide caption with short fade
    if (captionElement) {
        captionElement.style.transitionDuration = `${fadeOutTime}ms`;
        captionElement.style.opacity = '0';
    }
    
    // Start fading out current image
    if (currentHighRes) {
        currentHighRes.style.transitionDuration = `${fadeOutTime}ms`;
        currentHighRes.style.opacity = '0';
    }
    
    // Start next image BEFORE current one is fully gone
    // Creating a longer overlap effect
    setTimeout(() => {
        // Update current index
        currentIndex = nextIndex;
        
        // Show next image
        showImage(currentIndex);
    }, fadeOutTime - overlapTime); // Start next image before current one is fully gone
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Check if imageData is available
    if (typeof imageData !== 'undefined' && imageData.length > 0) {
        preloadImages();
        createImageElements();
    } else {
        console.error('Image data not found. Make sure image-config.js is loaded before script.js');
    }
});