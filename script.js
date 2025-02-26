// script.js
// Note: imageData should be defined in image-config.js and included before this script

const displayDuration = 5000; // How long each image is displayed (ms)
const fadeTransition = 1500;  // Duration of fade transition (ms)

// State
let currentIndex = 0;
let preloadedImages = new Set();
const imageContainer = document.querySelector('.image-container');
const captionElement = document.getElementById('current-caption');

// Preload all images
function preloadImages() {
    imageData.forEach(image => {
        // Preload low-res first
        const lowResImg = new Image();
        lowResImg.src = image.lowRes;
        lowResImg.onload = () => {
            // Once low-res is loaded, preload high-res
            const highResImg = new Image();
            highResImg.src = image.highRes;
            highResImg.onload = () => {
                preloadedImages.add(image.id);
                console.log(`Preloaded image ${image.id}`);
            };
        };
    });
}

// Clear all existing images from container
function clearImageContainer() {
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }
}

// Create all image elements
function createImageElements() {
    // First clear any existing images
    clearImageContainer();
    
    imageData.forEach((image) => {
        // Create low-res version with CSS blur
        const lowResElement = document.createElement('div');
        lowResElement.classList.add('artwork', 'lowres');
        lowResElement.id = `artwork-${image.id}-low`;
        
        // Use actual img elements
        const lowResImg = document.createElement('img');
        lowResImg.src = image.lowRes;
        lowResImg.alt = image.title;
        lowResElement.appendChild(lowResImg);
        
        // Create high-res version (initially hidden)
        const highResElement = document.createElement('div');
        highResElement.classList.add('artwork');
        highResElement.id = `artwork-${image.id}-high`;
        
        const highResImg = document.createElement('img');
        highResImg.src = image.highRes;
        highResImg.alt = image.title;
        highResElement.appendChild(highResImg);
        
        // Add to container
        imageContainer.appendChild(lowResElement);
        imageContainer.appendChild(highResElement);
    });
    
    // Display first image immediately
    const firstLowRes = document.getElementById(`artwork-${imageData[0].id}-low`);
    if (firstLowRes) {
        firstLowRes.classList.add('active');
        
        // Update caption for first image if caption element exists
        if (captionElement) {
            captionElement.textContent = imageData[0].title;
            captionElement.classList.add('active');
        }
    }
    
    // Start transition to high-res when it's loaded
    const checkFirstImageLoaded = setInterval(() => {
        if (preloadedImages.has(imageData[0].id)) {
            clearInterval(checkFirstImageLoaded);
            
            const firstHighRes = document.getElementById(`artwork-${imageData[0].id}-high`);
            if (firstHighRes) {
                setTimeout(() => {
                    firstHighRes.classList.add('active');
                    setTimeout(() => {
                        if (firstLowRes) {
                            firstLowRes.classList.remove('active');
                        }
                    }, fadeTransition / 2);
                }, 100);
                
                // Start cycling after display duration
                setTimeout(cycleImages, displayDuration);
            }
        }
    }, 100);
}

// Cycle to next image
function cycleImages() {
    // Calculate next index
    const nextIndex = (currentIndex + 1) % imageData.length;
    const nextId = imageData[nextIndex].id;
    const currentId = imageData[currentIndex].id;
    
    // Get elements
    const nextLowRes = document.getElementById(`artwork-${nextId}-low`);
    const nextHighRes = document.getElementById(`artwork-${nextId}-high`);
    const currentLowRes = document.getElementById(`artwork-${currentId}-low`);
    const currentHighRes = document.getElementById(`artwork-${currentId}-high`);
    
    // Safety check
    if (!nextLowRes || !nextHighRes || !currentLowRes || !currentHighRes) {
        console.error('Missing elements for transition');
        return;
    }
    
    // Show next low-res image
    nextLowRes.classList.add('active');
    
    // Update caption if it exists
    if (captionElement) {
        captionElement.classList.remove('active');
        setTimeout(() => {
            captionElement.textContent = imageData[nextIndex].title;
            captionElement.classList.add('active');
        }, fadeTransition / 2);
    }
    
    // Hide current images
    setTimeout(() => {
        currentHighRes.classList.remove('active');
        currentLowRes.classList.remove('active');
    }, fadeTransition / 2);
    
    // Show next high-res image when it's ready
    const checkNextImageLoaded = setInterval(() => {
        if (preloadedImages.has(nextId)) {
            clearInterval(checkNextImageLoaded);
            setTimeout(() => {
                nextHighRes.classList.add('active');
                setTimeout(() => {
                    nextLowRes.classList.remove('active');
                }, fadeTransition / 2);
            }, fadeTransition / 2);
        }
    }, 100);
    
    // Update current index
    currentIndex = nextIndex;
    
    // Schedule next transition
    setTimeout(cycleImages, displayDuration);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Check if imageData is available (should be loaded from image-config.js)
    if (typeof imageData !== 'undefined' && imageData.length > 0) {
        preloadImages();
        createImageElements();
    } else {
        console.error('Image data not found. Make sure image-config.js is loaded before script.js');
    }
});